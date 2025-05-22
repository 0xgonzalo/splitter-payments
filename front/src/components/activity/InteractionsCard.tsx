import { FileText } from "lucide-react"

// Sample interactions data
const interactions = [
  {
    id: "solsiete.eth",
    address: "0x3c3a81e81dc49A522A592e7e22A7E711c06bd3f54",
    amount: "$1000",
  },
  {
    id: "mantleuser.eth",
    address: "0x3c3a81e81dc49A522A592e7e22A7E711c06bd3f54",
    amount: "$250",
  },
  {
    id: "mantleuser2.eth",
    address: "0x3c3a81e81dc49A522A592e7e22A7E711c06bd3f54",
    amount: "$560",
  },
  {
    id: "0xFf68u6...",
    address: "0x3c3a81e81dc49A522A592e7e22A7E711c06bd3f54",
    amount: "$120",
  },
  {
    id: "0x33f6bb...",
    address: "0x3c3a81e81dc49A522A592e7e22A7E711c06bd3f54",
    amount: "$300",
  },
]

export default function InteractionsCard() {
  return (
    <div className="bg-[#0c1e3d]/80 rounded-lg backdrop-blur-sm h-full">
      <div className="p-5 border-b border-gray-800">
        <h2 className="text-white text-lg font-semibold">Most Interacted</h2>
      </div>

      <div className="divide-y divide-gray-800">
        {interactions.map((interaction) => (
          <div key={interaction.id} className="px-5 py-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-lg">👤</span>
              </div>
              <div>
                <p className="text-white text-sm font-medium">{interaction.id}</p>
                <p className="text-gray-400 text-xs truncate max-w-[200px]">{interaction.address}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-white font-medium">{interaction.amount}</span>
              <button className="text-gray-300 hover:text-white">
                <FileText className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
