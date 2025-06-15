
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnectButton: React.FC = () => {
  // Display RainbowKit's real connect button
  return (
    <ConnectButton 
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={false}
    />
  );
};

export default WalletConnectButton;
