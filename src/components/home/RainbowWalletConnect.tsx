
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const RainbowWalletConnect: React.FC = () => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 w-full">
      <ConnectButton />
    </div>
  );
};

export default RainbowWalletConnect;
