import React, { useRef, useEffect } from 'react';
import { ChatProps } from './types';

export const ChatMessages: React.FC<ChatProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with scroll to bottom on first render
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);

  return (
    <div 
      ref={chatContainerRef}
      className="flex-1 overflow-y-auto h-full px-6"
    >
      {messages.length <= 1 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="bg-[#112045]/50 p-6 rounded-lg max-w-2xl text-center">
            <p className="text-white">
              Let Nebula help you monitoring your contracts. Ask whatever you need about your contracts and Nebula is going to analyze and track your wallet to help you.
            </p>
          </div>
        </div>
      ) : (
        <div className="max-w-4xl mx-auto w-full">
          {messages.slice(1).map((message, index) => (
            <div key={index} className={`mb-4 ${message.role === 'user' ? 'text-right' : ''}`}>
              <div className={`inline-block p-3 rounded-lg ${
                message.role === 'user' 
                  ? 'bg-blue-600 text-white rounded-br-none' 
                  : 'bg-[#1a2542] text-white rounded-bl-none'
              }`}>
                {message.content}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="mb-4">
              <div className="inline-block p-3 rounded-lg bg-[#1a2542] text-white rounded-bl-none">
                <div className="flex space-x-2">
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}
    </div>
  );
}; 