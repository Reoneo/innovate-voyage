
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

// IMPORTANT: For this to work after deployment, make sure the environment variable
// VITE_WALLETCONNECT_PROJECT_ID is set in your platform's environment variables/settings
// with a valid WalletConnect Cloud Project ID.
// See https://cloud.walletconnect.com/sign-in > Projects > New Project > Platform: JavaScript

const WalletConnectButton: React.FC = () => {
  return (
    <ConnectButton 
      accountStatus="avatar"
      chainStatus="icon"
      showBalance={false}
    />
  );
};

export default WalletConnectButton;

