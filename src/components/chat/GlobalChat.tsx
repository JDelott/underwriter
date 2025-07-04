"use client";

import { useState, useRef, useEffect } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { ChatIcon, SendIcon } from '@/components/ui/AnalysisIcons';
import { ChatMessage } from '@/types';

interface GlobalChatProps {
  isOpen: boolean;
  onToggle: () => void;
}

// Helper function to create a ChatMessage with required properties
function createChatMessage(role: 'user' | 'assistant', content: string, dealId?: number): ChatMessage {
  return {
    id: Math.random().toString(36).substr(2, 9),
    role,
    content,
    timestamp: new Date().toISOString(),
    dealId
  };
}

export default function GlobalChat({ isOpen, onToggle }: GlobalChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const params = useParams();
  const pathname = usePathname();

  // Determine context based on current page
  const isDealsPage = pathname === '/deals';
  const dealId = params?.id ? parseInt(params.id as string) : undefined;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Add welcome message based on context
  useEffect(() => {
    if (messages.length === 0) {
      const welcomeContent = isDealsPage 
        ? "👋 Hi! I'm here to help you analyze and compare your deals. I have access to all your deal analysis data, so you can ask me to:\n\n• Compare deals side-by-side\n• Identify the best opportunities\n• Analyze specific metrics across deals\n• Highlight risks and opportunities\n• Get insights on financial performance\n\nWhat would you like to explore?"
        : dealId 
          ? "👋 Hi! I'm here to help you analyze this deal. I have access to all the analysis data for this property, so you can ask me about specific metrics, risks, opportunities, or any other aspects of this deal."
          : "👋 Hi! I'm your real estate underwriting assistant. I can help you analyze deals, answer questions about property investment, and provide insights on underwriting decisions. How can I help you today?";
      
      const welcomeMessage = createChatMessage('assistant', welcomeContent, dealId);
      setMessages([welcomeMessage]);
    }
  }, [isDealsPage, dealId, messages.length]);

  const handleSend = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage = createChatMessage('user', inputMessage.trim(), dealId);

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          dealId: dealId || null,
          isDealsPage: isDealsPage,
          conversationHistory: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      const data = await response.json();
      
      const assistantMessage = createChatMessage('assistant', data.response, dealId);

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = createChatMessage('assistant', 'Sorry, I encountered an error. Please try again.', dealId);
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // Only render when open
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-black/95 backdrop-blur-lg border border-emerald-400/30 rounded-lg shadow-2xl z-50 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-emerald-400/20">
        <div className="flex items-center space-x-2">
          <ChatIcon className="text-emerald-400" size={20} />
          <h3 className="text-white font-medium tracking-wide">
            {isDealsPage ? 'Deal Comparison Chat' : dealId ? 'Deal Analysis Chat' : 'AI Assistant'}
          </h3>
        </div>
        <button
          onClick={onToggle}
          className="text-gray-400 hover:text-white transition-colors"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12"/>
          </svg>
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] p-3 rounded-lg ${
                message.role === 'user'
                  ? 'bg-emerald-600 text-white ml-4'
                  : 'bg-gray-800 text-gray-100 mr-4'
              }`}
            >
              <div className="whitespace-pre-wrap text-sm leading-relaxed">
                {message.content}
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 text-gray-100 p-3 rounded-lg mr-4">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-emerald-400/20">
        <div className="flex space-x-2">
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={isDealsPage ? "Compare deals, analyze metrics..." : "Ask about this deal..."}
            className="flex-1 bg-gray-800 text-white px-3 py-2 rounded-lg border border-gray-600 focus:border-emerald-400 focus:outline-none text-sm"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!inputMessage.trim() || isLoading}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-600 text-white p-2 rounded-lg transition-colors"
          >
            <SendIcon size={16} />
          </button>
        </div>
      </div>
    </div>
  );
} 
