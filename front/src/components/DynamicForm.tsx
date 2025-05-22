"use client"

import { useState } from "react"
import { Minus } from "lucide-react"

interface Recipient {
  address: string
  percentage: string
}

export default function DynamicForm() {
  const [creatorWallet, setCreatorWallet] = useState("")
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", percentage: "0.00" },
    { address: "", percentage: "0.00" },
  ])
  const [creatorInitialPercentage, setCreatorInitialPercentage] = useState("30.00")
  const [maxCreatorPercentage, setMaxCreatorPercentage] = useState("70.00")
  const [percentageIncrease, setPercentageIncrease] = useState("5.00")
  const [milestoneEth, setMilestoneEth] = useState("")
  const [pricePerMint, setPricePerMint] = useState("")
  const [splitName, setSplitName] = useState("")
  const [description, setDescription] = useState("")

  const addRecipient = () => {
    setRecipients([...recipients, { address: "", percentage: "0.00" }])
  }

  const removeRecipient = (index: number) => {
    if (recipients.length <= 2) return
    const newRecipients = [...recipients]
    newRecipients.splice(index, 1)
    setRecipients(newRecipients)
  }

  const updateRecipient = (index: number, field: keyof Recipient, value: string) => {
    const newRecipients = [...recipients]
    newRecipients[index][field] = value
    setRecipients(newRecipients)
  }

  const calculateTotalPercentage = () => {
    return recipients.reduce((sum, recipient) => sum + parseFloat(recipient.percentage || "0"), 0)
  }

  return (
    <div className="bg-white/10 shadow-2xl rounded-3xl p-10 backdrop-blur-lg border border-white/20">
      {/* Creator Wallet Section */}
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

      {/* Recipients Section */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-medium mb-4">Recipients</h2>
        {recipients.map((recipient, index) => (
          <div key={index} className="flex items-center gap-3 mb-3">
            <input
              type="text"
              placeholder="Enter address or ENS"
              value={recipient.address}
              onChange={(e) => updateRecipient(index, "address", e.target.value)}
              className="flex-1 bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="w-24">
              <input
                type="text"
                placeholder="0.00%"
                value={`${recipient.percentage}%`}
                onChange={(e) => {
                  const value = e.target.value.replace(/%/g, "")
                  updateRecipient(index, "percentage", value)
                }}
                className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => removeRecipient(index)}
              className="w-10 h-10 flex items-center justify-center rounded-md bg-[#1a2542] text-gray-400 hover:text-white"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        ))}
        <div className="flex justify-between items-center mt-2">
          <button
            onClick={addRecipient}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Add Recipient
          </button>
          <p className="text-gray-500 text-sm">
            Total: {calculateTotalPercentage().toFixed(2)}% (must be ≤ 100%)
          </p>
        </div>
      </div>

      {/* Creator Percentage Settings */}
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

      {/* Milestone and Price Settings */}
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

      {/* Optional Fields */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-medium mb-4">Additional Information</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 text-sm mb-2">Contract Name</label>
            <input
              type="text"
              placeholder="Name"
              value={splitName}
              onChange={(e) => setSplitName(e.target.value)}
              className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-gray-500 text-sm mt-2">Offchain name to see inside the platform.</p>
          </div>
          <div>
            <label className="block text-gray-300 text-sm mb-2">Description (Optional)</label>
            <textarea
              placeholder="Describe your project or split logic"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium uppercase">
        CREATE DYNAMIC SPLIT
      </button>
    </div>
  )
} 