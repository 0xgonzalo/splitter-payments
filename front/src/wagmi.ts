import { http, createConfig } from 'wagmi'
import { mainnet, sepolia } from 'wagmi/chains'
import { coinbaseWallet, injected, walletConnect } from 'wagmi/connectors'
import { cookieStorage, createStorage } from 'wagmi'

export function getConfig() {
  return createConfig({
    chains: [mainnet, sepolia],
    connectors: [
      injected(),
      coinbaseWallet({ appName: 'Splitter Payments' }),
      walletConnect({ 
        projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID ?? (() => {
          throw new Error('NEXT_PUBLIC_WC_PROJECT_ID is required')
        })()
      }),
    ],
    storage: createStorage({
      storage: cookieStorage,
    }),
    ssr: true,
    transports: {
      [mainnet.id]: http(),
      [sepolia.id]: http(),
    },
  })
}
