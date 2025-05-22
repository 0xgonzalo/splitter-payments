"use client"

interface BountySettingsProps {
  bounty: string
  setBounty: React.Dispatch<React.SetStateAction<string>>
}

export default function BountySettings({ bounty, setBounty }: BountySettingsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Distribution Bounty</h2>
      <input
        type="text"
        placeholder="0.05%"
        value={`${bounty}%`}
        onChange={(e) => {
          const value = e.target.value.replace(/%/g, "")
          setBounty(value)
        }}
        className="w-48 bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <p className="text-gray-500 text-sm mt-2">If bounty is set to 0.00%, splits must be manually distributed.</p>
    </div>
  )
} 