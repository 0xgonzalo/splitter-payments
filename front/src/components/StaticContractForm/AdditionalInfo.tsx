"use client"

interface AdditionalInfoProps {
  contractName: string
  setContractName: React.Dispatch<React.SetStateAction<string>>
  description: string
  setDescription: React.Dispatch<React.SetStateAction<string>>
}

export default function AdditionalInfo({ 
  contractName, 
  setContractName, 
  description, 
  setDescription 
}: AdditionalInfoProps) {
  return (
    <div className="mb-8">
      <h2 className="text-white text-xl font-medium mb-4">Additional Information</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-gray-300 text-sm mb-2">Contract Name</label>
          <input
            type="text"
            placeholder="Name"
            value={contractName}
            onChange={(e) => setContractName(e.target.value)}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-gray-500 text-sm mt-2">Offchain name to see inside the platform.</p>
        </div>
        <div>
          <label className="block text-gray-300 text-sm mb-2">Description</label>
          <textarea
            placeholder="Describe your project or split logic"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full bg-[#1a2542] border border-gray-700 rounded-md px-4 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
          />
        </div>
      </div>
    </div>
  )
} 