
import React from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { initXMTP } from '@/services/xmtpService';

interface XmtpConnectionSectionProps {
  onConnect: (client: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  walletAddress?: string;
  onClientCreated?: (client: any) => void;
}

const XmtpConnectionSection: React.FC<XmtpConnectionSectionProps> = ({
  onConnect,
  isLoading,
  setIsLoading,
  walletAddress,
  onClientCreated
}) => {
  const { toast } = useToast();

  const connectToXMTP = async () => {
    setIsLoading(true);
    try {
      const client = await initXMTP();
      
      // Call both callbacks for backward compatibility
      if (onConnect) onConnect(client);
      if (onClientCreated) onClientCreated(client);
      
      toast({
        title: "XMTP Connected",
        description: "You are now connected to XMTP messaging",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to XMTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Connect to XMTP to start messaging other Ethereum accounts
      </p>
      <Button 
        className="w-full" 
        onClick={connectToXMTP}
        disabled={isLoading}
      >
        {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
        Connect to XMTP
      </Button>
    </div>
  );
};

export default XmtpConnectionSection;
