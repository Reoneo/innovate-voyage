
import React from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";

const RainbowKitWalletButton: React.FC = () => {
  return <ConnectButton showBalance={false} chainStatus="icon" />;
};

export default RainbowKitWalletButton;
