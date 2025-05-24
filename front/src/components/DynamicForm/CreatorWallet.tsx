import React from "react"

interface CreatorWalletProps {
  creatorWallet: string
  setCreatorWallet: (value: string) => void
}

export function CreatorWallet({ creatorWallet, setCreatorWallet }: CreatorWalletProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Creator Wallet</h2>
      <input
        type="text"
        placeholder="Enter creator wallet address"
        value={creatorWallet}
        onChange={(e) => setCreatorWallet(e.target.value)}
        className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-gray-500 text-sm mt-2">Your wallet address that will receive earnings and percentage increases.</p>
    </div>
  )
} 