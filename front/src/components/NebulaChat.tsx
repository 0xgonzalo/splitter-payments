import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export default function NebulaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Let Nebula help you monitoring your contracts. Ask whatever you need about your contracts and Nebula is going to analyze and track your wallet to help you.'
    }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    // Add user message
    setMessages(prev => [...prev, { role: 'user', content: input }]);
    
    // Simulate AI response after a short delay
    setTimeout(() => {
      let response = "I'm Nebula, an AI assistant for blockchain and smart contracts. I can help analyze your wallet activity, monitor contracts, and answer questions about cryptocurrency and blockchain technology.";
      
      if (input.toLowerCase().includes('earn')) {
        response = "Based on your wallet history, you've earned 0.15 ETH this month from your contracts.";
      } else if (input.toLowerCase().includes('contract') && input.toLowerCase().includes('profitable')) {
        response = "Your most profitable contract is the SplitterDynamic contract deployed on Ethereum, which has generated 0.08 ETH in the last 30 days.";
      } else if (input.toLowerCase().includes('erc20')) {
        response = "An ERC20 is a standard interface for fungible tokens on Ethereum. It includes functions like transfer(), approve(), and balanceOf() that all ERC20 tokens implement.";
      } else if (input.toLowerCase().includes('nebula')) {
        response = "I can help you monitor contracts, analyze wallet activity, and answer questions about blockchain technology. Just ask whatever you need!";
      } else if (input.toLowerCase().includes('balance')) {
        response = "You don't have any unclaimed balances in your splitter contracts at the moment.";
      }
      
      setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    }, 1000);
    
    setInput('');
  };
  
  const handleQuickQuestion = (question: string) => {
    setInput(question);
  };
  
  // Auto scroll to bottom of messages
  useEffect(() => {
    // Try to scroll to the last message
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize with scroll to bottom on first render
  useEffect(() => {
    // Scroll to bottom initially
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, []);
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      {/* Top Header with Logo - Styled to look like the image */}
      <div className="p-6">
        <div className="bg-[#0a1025] p-4 rounded-xl flex items-center">
          <div className="h-16 w-16 bg-purple-600 rounded-lg flex items-center justify-center mr-4">
            <svg viewBox="0 0 100 100" className="h-10 w-10 text-white">
              <path fill="currentColor" d="M47.1,95.1L47.1,95.1c-2.4,0-4.8-0.5-7.1-1.6L7.3,79.9c-3.9-1.8-6.4-5.8-6.4-10.1V30.1c0-4.3,2.5-8.3,6.4-10.1L40,6.5
                c4.5-2.1,9.8-2.1,14.3,0l32.6,13.5c3.9,1.8,6.4,5.8,6.4,10.1v39.7c0,4.3-2.5,8.3-6.4,10.1L54.3,93.5C52,94.6,49.6,95.1,47.1,95.1z"/>
              <path fill="#FFF" d="M28.9,76.8l10.4-25.8h8.3l-8,19.3h15.7v6.4H28.9z"/>
              <path fill="#FFF" d="M41.9,48.7V30.1h31.1v18.6H41.9z M47.1,42.3h20.4v-6.4H47.1V42.3z"/>
              <path fill="#FFF" d="M28.9,48.7V30.1h6.4v18.6H28.9z"/>
            </svg>
          </div>
          <div>
            <h2 className="text-white font-bold text-xl">Let Nebula help you monitoring your contracts</h2>
            <p className="text-gray-400 mt-1">Ask whatever you need about your contracts and Nebula is going to analyze and track your wallet to help you.</p>
          </div>
        </div>
      </div>
      
      {/* Chat Messages Area */}
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
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>
      
      {/* Input Area - Fixed at the bottom */}
      <div className="px-6 py-8 mt-auto">
        <div className="max-w-4xl mx-auto">
          {/* Chat Input */}
          <div className="bg-[#0a1025] rounded-xl p-4 mb-4">
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
              />
              <button 
                type="submit" 
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none"
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </div>
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => handleQuickQuestion("How much did I earn this month?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
            >
              How much did I earn this month?
            </button>
            <button 
              onClick={() => handleQuickQuestion("Which was my most profitable contract?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
            >
              Which was my most profitable contract?
            </button>
            <button 
              onClick={() => handleQuickQuestion("What can I do with Nebula?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
            >
              What can I do with Nebula?
            </button>
            <button 
              onClick={() => handleQuickQuestion("Do I have unclaimed balances?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
            >
              Do I have unclaimed balances?
            </button>
            <button 
              onClick={() => handleQuickQuestion("What is an ERC20?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
            >
              What is an ERC20?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 