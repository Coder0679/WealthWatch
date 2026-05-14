import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Bot, User, Loader2 } from 'lucide-react';
import { useChatStore } from '../store/chatStore';

const ChatBot: React.FC = () => {
  const { messages, isOpen, isTyping, openChat, closeChat, sendMessage, createSession } = useChatStore();
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    if (messages.length !== 0) return;

    // Prevent unauthorized calls on initial load when no token exists.
    const token = localStorage.getItem('token');
    if (!token) return;

    createSession();
  }, [isOpen, messages.length, createSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage(inputText.trim());
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleSend();
  };

  const quickReplies = ['Net Worth', 'Spending', 'Goals', 'Tips'];

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={openChat}
            className="w-14 h-14 bg-indigo-600 rounded-full flex items-center justify-center shadow-lg hover:bg-indigo-700 transition-colors"
          >
            <MessageSquare className="text-white w-6 h-6" />
          </motion.button>
        )}

        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-[350px] h-[550px] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-slate-800 p-4 flex items-center justify-between border-b border-slate-700">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                  <Bot className="text-white w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-white font-semibold text-sm">WealthWatch Assistant</h3>
                  <span className="text-[10px] text-gray-400">Powered by IBM Watson</span>
                </div>
              </div>
              <button 
                onClick={closeChat}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-hide">
              {messages.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-gray-400 text-sm mb-4">Hi! Ask me about your finances!</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {quickReplies.map(reply => (
                      <button
                        key={reply}
                        onClick={() => sendMessage(reply)}
                        className="text-xs bg-slate-800 border border-slate-700 text-gray-300 px-3 py-1.5 rounded-full hover:bg-slate-700 transition-colors"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {messages.map((msg) => (
                <div 
                  key={msg.id}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-md flex-shrink-0 flex items-center justify-center ${msg.sender === 'user' ? 'bg-indigo-600' : 'bg-slate-700'}`}>
                      {msg.sender === 'user' ? <User className="w-3.5 h-3.5 text-white" /> : <Bot className="w-3.5 h-3.5 text-white" />}
                    </div>
                    <div className={`p-3 rounded-2xl text-sm ${
                      msg.sender === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none' 
                        : 'bg-slate-800 text-gray-200 rounded-tl-none border border-slate-700'
                    }`}>
                      {msg.text}
                      <div className={`text-[10px] mt-1 opacity-50 ${msg.sender === 'user' ? 'text-right' : 'text-left'}`}>
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                   <div className="flex gap-2">
                    <div className="w-6 h-6 rounded-md bg-slate-700 flex items-center justify-center">
                      <Bot className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="bg-slate-800 p-3 rounded-2xl rounded-tl-none border border-slate-700">
                      <div className="flex gap-1">
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce"></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                        <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                      </div>
                    </div>
                   </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-800">
              <div className="relative">
                <input
                  type="text"
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-4 pr-12 py-3 text-sm text-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                />
                <button 
                  onClick={handleSend}
                  disabled={!inputText.trim()}
                  className="absolute right-2 top-2 p-1.5 text-indigo-500 hover:text-indigo-400 disabled:opacity-50 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatBot;
