"use client"

import { useState } from "react"
import { Minus } from "lucide-react"

interface Recipient {
  address: string
  percentage: string
}

export default function SplitContractForm() {
  const [recipients, setRecipients] = useState<Recipient[]>([
    { address: "", percentage: "0.00" },
    { address: "", percentage: "0.00" },
  ])
  const [controller, setController] = useState("")
  const [bounty, setBounty] = useState("0.05")
  const [monitoring, setMonitoring] = useState("1")
  const [contractName, setContractName] = useState("")

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

  return (
    <div className="bg-white/10 shadow-2xl rounded-3xl p-10 backdrop-blur-lg border border-white/20">
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

        <button
          onClick={addRecipient}
          className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add Recipient
        </button>
      </div>

      {/* Controller Section */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-medium mb-4">Controller</h2>
        <input
          type="text"
          placeholder="Enter address or ENS"
          value={controller}
          onChange={(e) => setController(e.target.value)}
          className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-500 text-sm mt-2">* Controller is not defined, splits will remain immutable.</p>
      </div>

      {/* Distribution Bounty Section */}
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

      {/* Split Monitoring Section */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-medium mb-4">Split Monitoring</h2>
        <input
          type="text"
          placeholder="1%"
          value={`${monitoring}%`}
          onChange={(e) => {
            const value = e.target.value.replace(/%/g, "")
            setMonitoring(value)
          }}
          className="w-48 bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-500 text-sm mt-2">Donate at least 0.1% to see advanced analytics.</p>
      </div>

      {/* Contract Name Section */}
      <div className="mb-8">
        <h2 className="text-white text-xl font-medium mb-4">Contract Name</h2>
        <input
          type="text"
          placeholder="Name"
          value={contractName}
          onChange={(e) => setContractName(e.target.value)}
          className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="text-gray-500 text-sm mt-2">Offchain name to see inside the platform.</p>
      </div>

      {/* Submit Button */}
      <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-md text-sm font-medium uppercase">
        CREATE SPLIT
      </button>
    </div>
  )
}
