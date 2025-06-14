
import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider, http } from "wagmi";
import { RainbowKitProvider, getDefaultConfig, darkTheme, type Chain } from "@rainbow-me/rainbowkit";
import { mainnet, sepolia } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// Define chains with tuple type for type-safety (wagmi v2+)
const chains: readonly [Chain, ...Chain[]] = [mainnet, sepolia];

// Use VITE_WC_PROJECT_ID if present, or fallback to demo for safety in dev
const projectId = import.meta.env.VITE_WC_PROJECT_ID || "demo";

// Use getDefaultConfig to generate wagmi config (RainbowKit v2+ API)
const config = getDefaultConfig({
  appName: "Recruitment.box",
  projectId,
  chains,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

// Create a QueryClient singleton
const queryClient = new QueryClient();

export function RainbowKitProviderWrapper({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          modalSize="compact"
          theme={darkTheme({
            accentColor: '#3b82f6', // Tailwind blue-500
            accentColorForeground: 'white',
            borderRadius: 'medium',
            fontStack: 'system',
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}

export default RainbowKitProviderWrapper;

