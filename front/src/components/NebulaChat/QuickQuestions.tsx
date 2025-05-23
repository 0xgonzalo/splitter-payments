import React from 'react';
import { QuickQuestionsProps } from './types';

export const QuickQuestions: React.FC<QuickQuestionsProps> = ({ handleQuickQuestion, isLoading }) => {
  const questions = [
    "How much did I earn this month?",
    "Which was my most profitable contract?",
    "List all contracts created from the factory contract",
    "Do I have unclaimed balances?",
    "What is the Static Contract Factory's purpose?"
  ];

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {questions.map((question, index) => (
        <button 
          key={index}
          onClick={() => handleQuickQuestion(question)}
          className="bg-[#1a2542] text-white text-sm rounded-full px-5 py-2.5 hover:bg-[#2a3552]"
          disabled={isLoading}
        >
          {question}
        </button>
      ))}
    </div>
  );
}; 