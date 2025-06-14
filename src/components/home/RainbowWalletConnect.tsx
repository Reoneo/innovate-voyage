
import React from 'react';
import RainbowWalletButton from '../wallet/RainbowWalletButton';
import EnsProfile from '../ens/EnsProfile';
import EnsSearch from '../ens/EnsSearch';

const RainbowWalletConnect: React.FC = () => {
  return (
    <div className="flex flex-col items-center gap-6 mb-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-white/80 text-sm mb-6">
          Connect your wallet to access ENS features and Web3 profiles
        </p>
        <RainbowWalletButton />
      </div>
      
      <div className="w-full max-w-md">
        <EnsProfile />
      </div>
      
      <div className="w-full max-w-md">
        <EnsSearch />
      </div>
    </div>
  );
};

export default RainbowWalletConnect;
