import { create } from 'zustand';
import { chatService } from '../services/chatService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

interface ChatState {
  messages: Message[];
  sessionId: string | null;
  isOpen: boolean;
  isTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  createSession: () => Promise<void>;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isOpen: false,
  isTyping: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  createSession: async () => {
    try {
      const { sessionId } = await chatService.createSession();
      set({ sessionId });
      
      // Auto-clear session after 30 minutes to force renewal
      setTimeout(() => {
        set({ sessionId: null });
        console.log('Chat session expired after 30 minutes');
      }, 30 * 60 * 1000);
      
    } catch (error) {
      console.error('Failed to create chat session:', error);
    }
  },
  sendMessage: async (text: string) => {
    const { sessionId, messages } = get();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set({ messages: [...messages, userMessage], isTyping: true });

    try {
      let currentSessionId = sessionId;
      if (!currentSessionId) {
        const { sessionId: newId } = await chatService.createSession();
        currentSessionId = newId;
        set({ sessionId: newId });
      }

      const response = await chatService.sendMessage(text, currentSessionId!);
      
      const botResponses = response.output?.generic || [];
      const newMessages: Message[] = botResponses.map((res: any, idx: number) => ({
        id: (Date.now() + idx + 1).toString(),
        text: res.text || 'Sorry, I didn\'t understand that.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }));

      set((state) => ({ 
        messages: [...state.messages, ...newMessages], 
        isTyping: false 
      }));
    } catch (error) {
      console.error('Failed to send message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, I am having trouble connecting right now.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      set((state) => ({ 
        messages: [...state.messages, errorMessage], 
        isTyping: false 
      }));
    }
  },
}));
