import '@rainbow-me/rainbowkit/styles.css'
import { QueryClient } from '@tanstack/react-query'
import { http, createConfig } from 'wagmi'
import { mantle, mantleSepolia } from './chains'
import { injected, walletConnect } from 'wagmi/connectors'

// Safely access environment variables
const getProjectId = () => {
  // Only access environment variables on the client side
  if (typeof window !== 'undefined') {
    return process.env.NEXT_PUBLIC_WC_PROJECT_ID || 'default_project_id'
  }
  return 'default_project_id'
}

const projectId = getProjectId()

export const config = createConfig({
  chains: [mantle, mantleSepolia],
  transports: {
    [mantle.id]: http(),
    [mantleSepolia.id]: http(),
  },
  connectors: [
    injected(),
    walletConnect({ projectId }),
  ],
  ssr: true,
})

export const queryClient = new QueryClient()
