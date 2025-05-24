import React from "react"

interface SubmitButtonProps {
  onClick?: () => void
}

export function SubmitButton({ onClick }: SubmitButtonProps) {
  return (
    <button 
      className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium uppercase"
      onClick={onClick}
    >
      CREATE DYNAMIC SPLIT
    </button>
  )
} 