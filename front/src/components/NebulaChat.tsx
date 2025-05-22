import { useState, useRef, useEffect } from 'react';
import { Paperclip, Send } from 'lucide-react';
import { client } from '@/client';
import { useAccount } from 'wagmi';
import { Nebula } from 'thirdweb/ai';
import { mantle, mantleSepolia } from '@/chains';

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
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  
  // Get the connected wallet address
  const { address } = useAccount();
  
  // Static Factory Contract address
  const FACTORY_CONTRACT_ADDRESS = '0xa38e93caaec44b8d9d9cfaa902ec6b4782b0e3e1';
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    
    // Add user message
    const userMessage = { role: 'user' as const, content: input };
    setMessages(prev => [...prev, userMessage]);
    
    // Clear input and set loading
    setInput('');
    setIsLoading(true);
    
    try {
      // Check if we have a client ID before proceeding
      if (!process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID) {
        throw new Error("Missing ThirdWeb Client ID. Please check your environment variables.");
      }
      
      // Check if user is connected - not strictly required but helps provide better feedback
      if (!address) {
        console.warn("No wallet connected, Nebula might provide limited responses");
      }
      
      // Create an array of messages for context
      const messageHistory = messages.slice(1).map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Add the new user message
      messageHistory.push({
        role: 'user' as const,
        content: input
      });

      console.log("Calling Nebula with context:", {
        messageCount: messageHistory.length,
        hasWallet: !!address,
        factoryContract: FACTORY_CONTRACT_ADDRESS
      });

      // Call Nebula API with simplified context filter
      const response = await Nebula.chat({
        client,
        messages: messageHistory.map(msg => ({
          role: msg.role as "user" | "assistant",
          content: msg.content
        })),
        contextFilter: {
          contractAddresses: [FACTORY_CONTRACT_ADDRESS],
          walletAddresses: address ? [address] : [],
          // Remove chains for now as it's causing type issues
        }
      });

      // Add the assistant's response to messages
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response.message }
      ]);
      
      // Check if there are any transactions to execute
      if (response.transactions && response.transactions.length > 0) {
        // You would typically handle transactions here, showing them to the user
        console.log('Suggested transactions:', response.transactions);
      }
    } catch (error) {
      console.error('Error communicating with Nebula:', error);
      
      // Provide a more specific error message if possible
      let errorMessage = 'I apologize, but I encountered an error processing your request. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes("Client ID")) {
          errorMessage = 'API configuration error: Missing or invalid ThirdWeb Client ID.';
        } else if (error.message.includes("rate limit") || error.message.includes("429")) {
          errorMessage = 'Nebula API rate limit exceeded. Please try again in a moment.';
        } else if (error.message.includes("unauthorized") || error.message.includes("401")) {
          errorMessage = 'Authorization error: Your account may not have access to Nebula or credentials are invalid.';
        }
        
        // Log the specific error for debugging
        console.error('Nebula error details:', error.message);
      }
      
      setMessages(prev => [
        ...prev,
        { role: 'assistant', content: errorMessage }
      ]);
    } finally {
      setIsLoading(false);
    }
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
          
          {/* Quick Questions */}
          <div className="flex flex-wrap gap-2 justify-center">
            <button 
              onClick={() => handleQuickQuestion("How much did I earn this month?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
              disabled={isLoading}
            >
              How much did I earn this month?
            </button>
            <button 
              onClick={() => handleQuickQuestion("Which was my most profitable contract?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
              disabled={isLoading}
            >
              Which was my most profitable contract?
            </button>
            <button 
              onClick={() => handleQuickQuestion("List all contracts created from the factory contract")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
              disabled={isLoading}
            >
              List all contracts created from the factory contract
            </button>
            <button 
              onClick={() => handleQuickQuestion("Do I have unclaimed balances?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
              disabled={isLoading}
            >
              Do I have unclaimed balances?
            </button>
            <button 
              onClick={() => handleQuickQuestion("What is the Static Contract Factory's purpose?")}
              className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
              disabled={isLoading}
            >
              What is the Static Contract Factory's purpose?
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 