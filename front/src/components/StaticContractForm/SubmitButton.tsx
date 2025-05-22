"use client"

interface SubmitButtonProps {
  handleSubmit: () => void
  isPending: boolean
  isConfirming: boolean
}

export default function SubmitButton({ 
  handleSubmit, 
  isPending, 
  isConfirming 
}: SubmitButtonProps) {
  return (
    <button 
      onClick={handleSubmit}
      disabled={isPending || isConfirming}
      className={`w-full ${
        isPending || isConfirming 
          ? "bg-blue-400" 
          : "bg-blue-600 hover:bg-blue-700"
      } text-white py-3 rounded-md text-sm font-medium uppercase`}
    >
      {isPending 
        ? "Waiting for wallet..." 
        : isConfirming 
          ? "Creating contract..." 
          : "CREATE SPLIT"}
    </button>
  )
} 