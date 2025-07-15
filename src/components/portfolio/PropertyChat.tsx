"use client";

import React, { useState } from 'react';

interface PropertyChatProps {
  propertyId: number;
  propertyName: string;
}

export default function PropertyChat({ propertyId, propertyName }: PropertyChatProps) {
  const [messages, setMessages] = useState<Array<{role: 'user' | 'assistant', content: string}>>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setLoading(true);

    try {
      const response = await fetch('/api/chat/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userMessage,
          propertyId
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: 'assistant', content: data.response }]);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
      }
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I encountered an error processing your request.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border border-white/[0.08] rounded-lg p-4 bg-white/[0.03]">
      <h3 className="font-semibold mb-4 text-white">Chat with {propertyName} Document</h3>
      
      <div className="h-64 overflow-y-auto bg-black/50 rounded border border-gray-600 p-3 mb-4">
        {messages.length === 0 ? (
          <p className="text-gray-400">Ask questions about this property&apos;s financials, risks, or investment potential...</p>
        ) : (
          messages.map((msg, idx) => (
            <div key={idx} className={`mb-3 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
              <div className={`inline-block px-3 py-2 rounded-lg max-w-xs ${
                msg.role === 'user' 
                  ? 'bg-emerald-500 text-white' 
                  : 'bg-gray-700 text-gray-100'
              }`}>
                {msg.content}
              </div>
            </div>
          ))
        )}
        {loading && (
          <div className="text-left">
            <div className="inline-block px-3 py-2 rounded-lg bg-gray-700 text-gray-100">
              Thinking...
            </div>
          </div>
        )}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="Ask about cap rates, NOI, risks, etc..."
          className="flex-1 px-3 py-2 bg-black/50 border border-gray-600 text-white placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading || !input.trim()}
          className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-400 hover:to-green-500 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          Send
        </button>
      </div>
    </div>
  );
} 
