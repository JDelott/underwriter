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
    <button
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed bottom-4 right-4 z-40 w-14 h-14 bg-gradient-to-r from-emerald-400 to-green-500 hover:from-emerald-300 hover:to-green-400 rounded-full shadow-lg shadow-emerald-400/40 hover:shadow-emerald-400/60 transition-all duration-300 flex items-center justify-center ${
        isHovered ? 'scale-110' : ''
      }`}
    >
      <ChatIcon className="text-black" size={24} />
      {hasNotification && (
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-black"></div>
      )}
      {isHovered && (
        <div className="absolute bottom-16 right-0 bg-black/90 text-white px-3 py-1 rounded-lg text-sm whitespace-nowrap">
          Chat with AI
        </div>
      )}
    </button>
  );
} 
