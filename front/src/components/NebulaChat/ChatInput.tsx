import React from 'react';
import { Paperclip, Send } from 'lucide-react';
import { ChatInputProps } from './types';

export const ChatInput: React.FC<ChatInputProps> = ({ input, setInput, handleSubmit, isLoading }) => {
  return (
    <div className="bg-[#0a1025] rounded-xl p-4">
      <form onSubmit={handleSubmit} className="flex items-center">
        <button type="button" className="p-2 text-gray-400 hover:text-white">
          <Paperclip className="h-5 w-5" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask Nebula something"
          className="flex-1 bg-transparent text-white border-none outline-none p-2 mx-2"
          disabled={isLoading}
        />
        <button 
          type="submit" 
          className={`p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}; 