import Link from "next/link"
import { Bell } from "lucide-react"
import { ConnectButton } from '@rainbow-me/rainbowkit'

interface HeaderProps {
  title?: string;
}

export default function Header({ title = "Create" }: HeaderProps) {
  return (
    <header className="border-b border-gray-800 bg-[#0a1025]/50 backdrop-blur-sm p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2 text-gray-300">
          <Link href="/" className="hover:text-white">
            Pages
          </Link>
          <span>/</span>
          <span className="text-white">{title}</span>
        </div>
        <div className="flex items-center space-x-4">
          <button className="text-gray-300 hover:text-white">
            <Bell className="h-5 w-5" />
          </button>
          <ConnectButton />
        </div>
      </div>
    </header>
  )
}
