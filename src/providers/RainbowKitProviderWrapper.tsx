
import React from "react";
import { WagmiConfig, createConfig, configureChains, sepolia, mainnet } from "wagmi";
import { publicProvider } from "wagmi/providers/public";
import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import '@rainbow-me/rainbowkit/styles.css';

const { chains, publicClient } = configureChains(
  [mainnet, sepolia],
  [publicProvider()],
);

const { connectors } = getDefaultWallets({
  appName: "Recruitment.box",
  projectId: import.meta.env.VITE_WC_PROJECT_ID || "demo",
  chains,
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient,
});

const RainbowKitProviderWrapper = ({ children }: { children: React.ReactNode }) => {
  // You could set theme based on your app theme context if available
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider
        chains={chains}
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
