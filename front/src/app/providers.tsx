'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { type ReactNode, useState, useEffect } from 'react'
import { WagmiProvider } from 'wagmi'
import { RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { config } from '@/wagmi'

// Mock storage implementation for environments where localStorage is not available
const noopStorage = {
  getItem: (_key: string) => null,
  setItem: (_key: string, _value: string) => {},
  removeItem: (_key: string) => {},
};

// Create a storage wrapper to handle errors
const createStorage = () => {
  if (typeof window === 'undefined') return noopStorage;
  
  try {
    // Test if localStorage is accessible
    localStorage.getItem('test');
    return localStorage;
  } catch (e) {
    console.error('Local storage is not available:', e);
    return noopStorage;
  }
};

// Define a function component to handle the environment check
export function Providers({ children }: { children: ReactNode }) {
  // Create a client
  const [queryClient] = useState(() => new QueryClient())
  const [mounted, setMounted] = useState(false)

  // Ensure we only render in the browser to avoid hydration errors
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null // Return nothing on server

  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}
