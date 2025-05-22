"use client"

interface TransactionStatusProps {
  txError: string | null
  error: Error | null
  isConfirmed: boolean
  hash: `0x${string}` | undefined
}

export default function TransactionStatus({ 
  txError, 
  error, 
  isConfirmed, 
  hash 
}: TransactionStatusProps) {
  return (
    <>
      {/* Transaction Status Messages */}
      {txError && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">
          {txError}
        </div>
      )}
      
      {error && (
        <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-300">
          {error.message || "Transaction failed. Please try again."}
        </div>
      )}
      
      {isConfirmed && (
        <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-300">
          Contract created successfully!
        </div>
      )}
      
      {hash && (
        <div className="mb-4 p-3 bg-blue-500/20 border border-blue-500 rounded-md text-blue-300">
          <p>Transaction hash:</p>
          <a 
            href={`https://sepolia.mantlescan.xyz/tx/${hash}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-400 underline break-all"
          >
            {hash}
          </a>
        </div>
      )}
    </>
  )
} 