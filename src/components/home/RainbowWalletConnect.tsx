
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const RainbowWalletConnect: React.FC = () => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
        <ConnectButton />
      </div>
    </div>
  );
};

export default RainbowWalletConnect;
