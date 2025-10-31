"use client"

import { createAppKit } from "@reown/appkit/react"
import { WagmiProvider } from "wagmi"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi"
import type { ReactNode } from "react"
import { defineChain } from "viem"

const projectId = process.env.REACT_APP_REOWN_PROJECT_ID || process.env.REACT_APP_WC_PROJECT_ID || ""

if (!projectId) {
  // eslint-disable-next-line no-console
  console.warn("Reown/WalletConnect project id is missing. Set REACT_APP_REOWN_PROJECT_ID or REACT_APP_WC_PROJECT_ID in .env")
}

const metadata = {
  name: "POLYHEDX",
  description: "Prediction battle dApp on Hedera",
  url: typeof window !== "undefined" ? window.location.origin : "https://polyhedx.app",
  icons: [typeof window !== "undefined" ? window.location.origin + "/favicon.ico" : "https://polyhedx.app/favicon.ico"],
}

const hederaTestnet = defineChain({
  id: 296,
  name: "Hedera Testnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://testnet.hashio.io/api"] },
    public: { http: ["https://testnet.hashio.io/api"] },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/testnet", apiUrl: "https://testnet.hashscan.io/api" },
  },
  testnet: true,
})

const hederaMainnet = defineChain({
  id: 295,
  name: "Hedera Mainnet",
  nativeCurrency: { name: "HBAR", symbol: "HBAR", decimals: 18 },
  rpcUrls: {
    default: { http: ["https://mainnet.hashio.io/api"] },
    public: { http: ["https://mainnet.hashio.io/api"] },
  },
  blockExplorers: {
    default: { name: "HashScan", url: "https://hashscan.io/mainnet", apiUrl: "https://mainnet.hashscan.io/api" },
  },
  testnet: false,
})

const networks = [hederaTestnet, hederaMainnet]

const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
})

createAppKit({
  adapters: [wagmiAdapter],
  networks: (wagmiAdapter as any).networks ?? (networks as unknown as any),
  projectId,
  metadata,
  features: { analytics: false },
  themeMode: "dark",
})

const queryClient = new QueryClient()

export function Web3Provider({ children }: { children: ReactNode }) {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </WagmiProvider>
  )
}


