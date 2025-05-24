import React from "react"

interface MilestoneSettingsProps {
  milestoneEth: string
  setMilestoneEth: (value: string) => void
  pricePerMint: string
  setPricePerMint: (value: string) => void
}

export function MilestoneSettings({
  milestoneEth,
  setMilestoneEth,
  pricePerMint,
  setPricePerMint,
}: MilestoneSettingsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Milestone and Price Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Milestone in ETH</label>
          <input
            type="text"
            placeholder="Enter ETH amount"
            value={milestoneEth}
            onChange={(e) => setMilestoneEth(e.target.value)}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-2">Total ETH needed to trigger percentage increase</p>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Price Per Mint (ETH)</label>
          <input
            type="text"
            placeholder="Enter ETH amount"
            value={pricePerMint}
            onChange={(e) => setPricePerMint(e.target.value)}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-2">Must match your minting platform price</p>
        </div>
      </div>
    </div>
  )
} 