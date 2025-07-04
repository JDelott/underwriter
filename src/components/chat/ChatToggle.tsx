"use client";

import { useState } from 'react';
import { ChatIcon } from '@/components/ui/AnalysisIcons';

interface ChatToggleProps {
  onClick: () => void;
  hasNotification?: boolean;
}

export default function ChatToggle({ onClick, hasNotification = false }: ChatToggleProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      <button
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className={`w-16 h-16 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 rounded-2xl shadow-xl shadow-emerald-400/40 hover:shadow-emerald-400/60 transition-all duration-300 flex items-center justify-center group ${
          isHovered ? 'scale-110' : ''
        }`}
      >
        <ChatIcon className="text-black group-hover:scale-110 transition-transform duration-200" size={26} />
        {hasNotification && (
          <div className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full border-3 border-white shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 bg-white rounded-full"></div>
          </div>
        )}
      </button>
      
      {isHovered && (
        <div className="absolute bottom-20 right-0 bg-black/90 text-white px-4 py-2 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-emerald-400/20 shadow-lg">
          <div className="font-medium">Chat with AI Assistant</div>
          <div className="text-xs text-gray-300 mt-1">Get help with underwriting</div>
          {/* Tooltip arrow */}
          <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-l-transparent border-r-transparent border-t-black/90"></div>
        </div>
      )}
    </div>
  );
} 
