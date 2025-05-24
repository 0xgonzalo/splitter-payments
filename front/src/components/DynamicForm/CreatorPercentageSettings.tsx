import React from "react"

interface CreatorPercentageSettingsProps {
  creatorInitialPercentage: string
  setCreatorInitialPercentage: (value: string) => void
  maxCreatorPercentage: string
  setMaxCreatorPercentage: (value: string) => void
  percentageIncrease: string
  setPercentageIncrease: (value: string) => void
}

export function CreatorPercentageSettings({
  creatorInitialPercentage,
  setCreatorInitialPercentage,
  maxCreatorPercentage,
  setMaxCreatorPercentage,
  percentageIncrease,
  setPercentageIncrease,
}: CreatorPercentageSettingsProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Creator Percentage Settings</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Initial Percentage</label>
          <input
            type="text"
            placeholder="30.00%"
            value={`${creatorInitialPercentage}%`}
            onChange={(e) => {
              const value = e.target.value.replace(/%/g, "")
              setCreatorInitialPercentage(value)
            }}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Maximum Percentage</label>
          <input
            type="text"
            placeholder="70.00%"
            value={`${maxCreatorPercentage}%`}
            onChange={(e) => {
              const value = e.target.value.replace(/%/g, "")
              setMaxCreatorPercentage(value)
            }}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Percentage Increase per Milestone</label>
          <input
            type="text"
            placeholder="5.00%"
            value={`${percentageIncrease}%`}
            onChange={(e) => {
              const value = e.target.value.replace(/%/g, "")
              setPercentageIncrease(value)
            }}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  )
} 