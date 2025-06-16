
import React, { useEffect, useState } from 'react';
import { getWalletKit } from '@/lib/walletkit';
import { useToast } from '@/hooks/use-toast';

const WalletConnectButton: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [account, setAccount] = useState<string | null>(null);
  const [walletKit, setWalletKit] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    (async () => {
      try {
        const kit = await getWalletKit();
        setWalletKit(kit);
        console.log('WalletKit initialized:', kit);
        
        // Check if there are any existing sessions
        if (kit.getActiveSessions && Object.keys(kit.getActiveSessions()).length > 0) {
          const sessions = kit.getActiveSessions();
          const firstSession = Object.values(sessions)[0] as any;
          if (firstSession?.namespaces?.eip155?.accounts?.[0]) {
            const accountString = firstSession.namespaces.eip155.accounts[0];
            const address = accountString.split(':')[2];
            setAccount(address);
            setConnected(true);
          }
        }
      } catch (error) {
        console.error('Error initializing WalletKit:', error);
        toast({
          title: "Wallet Error",
          description: "Failed to initialize wallet connection",
          variant: "destructive",
        });
      }
    })();
  }, [toast]);

  const handleConnect = async () => {
    if (!walletKit) {
      toast({
        title: "Wallet Error",
        description: "Wallet not initialized",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create connection URI for WalletConnect
      const { uri, approval } = await walletKit.connect({
        requiredNamespaces: {
          eip155: {
            methods: ['eth_sendTransaction', 'personal_sign'],
            chains: ['eip155:1'],
            events: ['accountsChanged', 'chainChanged']
          }
        }
      });

      if (uri) {
        // Open WalletConnect modal or QR code
        console.log('WalletConnect URI:', uri);
        
        // For now, we'll show the URI in a toast - you might want to show a QR code modal instead
        toast({
          title: "Scan QR Code",
          description: "Open your wallet app and scan the QR code to connect",
        });
        
        // Wait for approval
        const session = await approval();
        console.log('Session approved:', session);
        
        if (session?.namespaces?.eip155?.accounts?.[0]) {
          const accountString = session.namespaces.eip155.accounts[0];
          const address = accountString.split(':')[2];
          setAccount(address);
          setConnected(true);
          
          toast({
            title: "Wallet Connected",
            description: `Connected to ${address.slice(0, 6)}...${address.slice(-4)}`,
          });
        }
      }
    } catch (error) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: "Failed to connect wallet",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    if (!walletKit) return;

    try {
      const sessions = walletKit.getActiveSessions();
      const sessionKeys = Object.keys(sessions);
      
      if (sessionKeys.length > 0) {
        await walletKit.disconnect({
          topic: sessionKeys[0],
          reason: {
            code: 6000,
            message: 'User disconnected'
          }
        });
      }
      
      setConnected(false);
      setAccount(null);
      
      toast({
        title: "Wallet Disconnected",
        description: "Successfully disconnected from wallet",
      });
    } catch (error) {
      console.error('Error disconnecting wallet:', error);
      toast({
        title: "Disconnect Error",
        description: "Failed to disconnect wallet",
        variant: "destructive",
      });
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
