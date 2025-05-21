import Link from "next/link"
import { Home, BarChart2, Plus } from "lucide-react"

interface SidebarProps {
  activePage?: string
}

export default function Sidebar({ activePage = "create" }: SidebarProps) {
  return (
    <div className="w-56 bg-[#0a1025] border-r border-gray-800 flex flex-col h-full">
      <div className="p-6">
        <h1 className="text-white font-bold text-xl tracking-wider">SPLIT//TER</h1>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        <Link
          href="/"
          className={`flex items-center space-x-3 rounded-md px-3 py-2.5 ${
            activePage === "create" ? "text-white bg-blue-600" : "text-gray-400 hover:text-white"
          }`}
        >
          <Plus className="h-5 w-5" />
          <span>Create</span>
        </Link>

        <Link
          href="/dashboard"
          className={`flex items-center space-x-3 rounded-md px-3 py-2.5 ${
            activePage === "dashboard" ? "text-white bg-blue-600" : "text-gray-400 hover:text-white"
          }`}
        >
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Link>

        <Link
          href="/activity"
          className={`flex items-center space-x-3 rounded-md px-3 py-2.5 ${
            activePage === "activity" ? "text-white bg-blue-600" : "text-gray-400 hover:text-white"
          }`}
        >
          <BarChart2 className="h-5 w-5" />
          <span>Activity</span>
        </Link>
      </nav>

      <div className="px-4 py-4">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">ACCOUNT PAGES</h3>
        <Link href="#" className="flex items-center space-x-3 text-gray-400 hover:text-white rounded-md px-3 py-2.5">
          <div className="h-5 w-5 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">AI</div>
          <span>Ask AI</span>
        </Link>
      </div>

      <div className="p-4 mt-auto">
        <div className="bg-gradient-to-br from-[#0a1025] to-[#1a2542] rounded-lg p-4 border border-gray-800">
          <h3 className="text-white font-medium mb-1">Need help?</h3>
          <p className="text-gray-400 text-sm mb-3">Please check our docs</p>
          <button className="w-full bg-[#1a2542] text-gray-300 py-1.5 rounded text-sm">DOCUMENTATION</button>
        </div>
      </div>
    </div>
  )
}
