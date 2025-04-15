
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { toast } from 'sonner';

interface AddressDisplayProps {
  address: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address }) => {
  const copyAddressToClipboard = () => {
    if (address) {
      navigator.clipboard.writeText(address);
      toast.success("Address copied to clipboard");
    }
  };

  // Custom truncate function to show first 5 and last 5 characters
  const customTruncateAddress = (addr: string): string => {
    if (!addr || typeof addr !== 'string' || addr.length <= 10) return addr;
    return `${addr.substring(0, 5)}...${addr.substring(addr.length - 5)}`;
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground">
        {address && typeof address === 'string' ? customTruncateAddress(address) : ''}
      </span>
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 w-6 p-0" 
        onClick={copyAddressToClipboard}
        disabled={!address}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
};

export default AddressDisplay;
