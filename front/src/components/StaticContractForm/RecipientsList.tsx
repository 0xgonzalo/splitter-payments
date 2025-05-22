"use client"

import { Minus } from "lucide-react"

interface Recipient {
  address: string
  percentage: string
}

interface RecipientsListProps {
  recipients: Recipient[]
  setRecipients: React.Dispatch<React.SetStateAction<Recipient[]>>
  calculateTotalPercentage: () => number
}

export default function RecipientsList({ 
  recipients, 
  setRecipients, 
  calculateTotalPercentage 
}: RecipientsListProps) {
  
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
          Total: {calculateTotalPercentage().toFixed(2)}% (must be 100%)
        </p>
      </div>
    </div>
  )
} 