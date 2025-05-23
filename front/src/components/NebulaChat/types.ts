export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatProps {
  messages: Message[];
  isLoading: boolean;
}

export interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  isLoading: boolean;
}

export interface QuickQuestionsProps {
  handleQuickQuestion: (question: string) => void;
  isLoading: boolean;
} 