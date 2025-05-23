import React from 'react';

export const ChatHeader: React.FC = () => {
  return (
    <div className="p-6">
      <div className="bg-[#0a1025] p-4 rounded-xl flex items-center">
        <div className="h-16 w-16 flex items-center justify-center mr-4">
          <img src="/images/thirdweb.png" alt="Thirdweb Logo" className="" />
        </div>
        <div>
          <h2 className="text-white font-bold text-xl">Let Nebula help you monitoring your contracts</h2>
          <p className="text-gray-400 mt-1">Ask whatever you need about your contracts and Nebula is going to analyze and track your wallet to help you.</p>
        </div>
      </div>
    </div>
  );
}; 