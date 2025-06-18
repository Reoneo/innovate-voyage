
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const RainbowWalletConnect: React.FC = () => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8 w-full">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md flex justify-center">
        <ConnectButton 
          chainStatus="icon"
          accountStatus={{
            smallScreen: 'avatar',
            largeScreen: 'full',
          }}
          showBalance={{
            smallScreen: false,
            largeScreen: true,
          }}
        />
      </div>
    </div>
  );
};

export default RainbowWalletConnect;
