'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'
import Sidebar from '@/components/Sidebar'
import Header from '@/components/Header'
import { usePathname } from 'next/navigation'

const inter = Inter({ subsets: ['latin'] })

// Metadata needs to be moved to a separate file since we're using 'use client'
// This is just for reference and won't be used
const metadataInfo = {
  title: "Split Contract Creator",
  description: "Create and manage split contracts for token distribution",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const pathname = usePathname()
  
  let activePage = "create"
  if (pathname === "/dashboard") activePage = "dashboard"
  if (pathname === "/activity") activePage = "activity"
  if (pathname === "/ai") activePage = "ai"

  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex h-screen bg-gradient-to-br from-[#0a1025] to-[#0f2e5c]">
            <Sidebar activePage={activePage} />
            <div className="flex-1 flex flex-col">
              <Header title={activePage.charAt(0).toUpperCase() + activePage.slice(1)} />
              <main className="flex-1 overflow-auto">
                {children}
              </main>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  )
}
