import Link from "next/link"
import { Bell } from "lucide-react"

export default function DashboardHeader() {
  return (
    <header className="border-b border-gray-800 bg-[#0a1025]/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-300">
          <Link href="/" className="hover:text-white">
            Pages
          </Link>
          <span>/</span>
          <span className="text-white">Dashboard</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white relative">
            <Bell className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 h-2 w-2 bg-blue-500 rounded-full"></span>
          </button>
          <button className="flex items-center space-x-2 text-gray-300 hover:text-white bg-[#1a2542] rounded-md px-3 py-1.5">
            <span>Sign In</span>
          </button>
        </div>
      </div>
    </header>
  )
}
