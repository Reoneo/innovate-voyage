
interface Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (args: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
  connectWalletModal: HTMLDialogElement;
  xmtpMessageModal: HTMLDialogElement;
  connectedWalletAddress: string | null;
  Buffer: typeof Buffer;
  global?: typeof globalThis;
  walletConnectModal?: {
    open: () => void;
    close: () => void;
  };
}

interface ImportMetaEnv {
  VITE_ETHERSCAN_API_KEY: string;
  VITE_ETHERSCAN_API_URL?: string;
  VITE_ETHEREUM_RPC_URL?: string;
  VITE_OPTIMISM_RPC_URL?: string;
  VITE_WC_PROJECT_ID?: string;
  readonly DEV: boolean;
}

// For Vite client types
interface ImportMeta {
  readonly env: ImportMetaEnv;
}
