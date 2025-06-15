
import React, { useEffect, useState } from 'react';
import { getWalletKit } from '@/lib/walletkit';

const WalletConnectButton: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [walletKit, setWalletKit] = useState<any>(null);

  useEffect(() => {
    let unsub: any;
    (async () => {
      const kit = await getWalletKit();
      setWalletKit(kit);

      unsub = kit.on('accountsChanged', (accs: string[]) => {
        setAccount(accs[0] || null);
        setConnected(!!accs[0]);
      });

      // Try to restore session
      if (kit.accounts && kit.accounts.length > 0) {
        setAccount(kit.accounts[0]);
        setConnected(true);
      }
    })();

    return () => {
      if (unsub) unsub();
    };
  }, []);

  const handleConnect = async () => {
    if (walletKit) {
      await walletKit.connect();
      setConnected(walletKit.accounts.length > 0);
      setAccount(walletKit.accounts[0] || null);
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
