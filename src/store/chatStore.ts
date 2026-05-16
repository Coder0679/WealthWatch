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
  isOpen: boolean;
  isTyping: boolean;
  openChat: () => void;
  closeChat: () => void;
  sendMessage: (text: string) => Promise<void>;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),
  sendMessage: async (text: string) => {
    const { messages } = get();
    
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      text,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    set({ messages: [...messages, userMessage], isTyping: true });

    try {
      const response = await chatService.sendMessage(text);
      
      const newMessages: Message[] = [{
        id: (Date.now() + 1).toString(),
        text: response.reply || 'Sorry, I didn\'t understand that.',
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }];

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
