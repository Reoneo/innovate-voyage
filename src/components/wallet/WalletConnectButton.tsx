
import React, { useEffect, useState } from 'react';
import { getWalletKit } from '@/lib/walletkit';

const WalletConnectButton: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [walletKit, setWalletKit] = useState<any>(null);

  // Helper to refresh account info
  const refreshAccounts = async (kit: any) => {
    if (kit) {
      const accounts = await kit.getAccounts();
      setAccount(accounts && accounts.length > 0 ? accounts[0] : null);
      setConnected(!!(accounts && accounts.length > 0));
    }
  };

  useEffect(() => {
    (async () => {
      const kit = await getWalletKit();
      setWalletKit(kit);

      // Try to restore session/account if any
      refreshAccounts(kit);
    })();
  }, []);

  const handleConnect = async () => {
    if (walletKit) {
      await walletKit.connect();
      refreshAccounts(walletKit);
    }
  };

  const handleDisconnect = async () => {
    if (walletKit) {
      await walletKit.disconnect();
      setConnected(false);
      setAccount(null);
    }
  };

  if (!connected) {
    return (
      <button
        type="button"
        onClick={handleConnect}
        className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors"
      >
        Connect Wallet
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <span className="truncate bg-secondary text-secondary-foreground px-3 py-2 rounded-md">
        {account ? account.slice(0, 6) + '...' + account.slice(-4) : 'Connected'}
      </span>
      <button
        type="button"
        onClick={handleDisconnect}
        className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-3 py-2 rounded-md"
      >
        Disconnect
      </button>
    </div>
  );
};

export default WalletConnectButton;

