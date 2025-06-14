
import React from "react";
import { WagmiConfig, createConfig } from "wagmi";
import { mainnet, sepolia } from "wagmi/chains";
import { http } from "viem";
import { getDefaultWallets, RainbowKitProvider, darkTheme } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';

// Define supported chains and configure transports
const chains = [mainnet, sepolia];

const projectId = import.meta.env.VITE_WC_PROJECT_ID || "demo";
const { connectors } = getDefaultWallets({
  appName: "Recruitment.box",
  projectId,
  chains,
});

// Setup wagmiConfig following wagmi v2 config
const wagmiConfig = createConfig({
  connectors,
  transports: {
    [mainnet.id]: http(),
    [sepolia.id]: http(),
  },
});

const RainbowKitProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  // Only applies dark theme for now, could be dynamic per app theme
  return (
    <WagmiConfig config={wagmiConfig}>
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
    </WagmiConfig>
  );
};

export default RainbowKitProviderWrapper;

