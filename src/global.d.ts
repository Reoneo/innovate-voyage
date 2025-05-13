
declare module '@web3modal/react';
declare module '@web3modal/ethereum';

// Declare XMTP modal for global access
interface Window {
  xmtpMessageModal?: HTMLDialogElement;
  connectWalletModal?: HTMLDialogElement;
  connectedWalletAddress?: string | null;
}
