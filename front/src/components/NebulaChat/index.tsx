import { useState } from 'react';
import { useAccount } from 'wagmi';
import { client } from '@/client';
import { Nebula } from 'thirdweb/ai';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { ChatInput } from './ChatInput';
import { QuickQuestions } from './QuickQuestions';
import { Message } from './types';

export default function NebulaChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: 'Let Nebula help you monitoring your contracts. Ask whatever you need about your contracts and Nebula is going to analyze and track your wallet to help you.'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
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
        }
      });

      // Add the assistant's response to messages
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response.message }
      ]);
      
      // Check if there are any transactions to execute
      if (response.transactions && response.transactions.length > 0) {
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
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-blue-900 via-blue-800 to-blue-950">
      <ChatHeader />
      
      <ChatMessages messages={messages} isLoading={isLoading} />
      
      <div className="px-6 py-8 mt-auto">
        <div className="max-w-4xl mx-auto">
          <ChatInput 
            input={input}
            setInput={setInput}
            handleSubmit={handleSubmit}
            isLoading={isLoading}
          />
          
          <div className="mt-4">
            <QuickQuestions 
              handleQuickQuestion={handleQuickQuestion}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
} 