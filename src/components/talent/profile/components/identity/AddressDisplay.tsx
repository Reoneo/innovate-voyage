
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy, MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface AddressDisplayProps {
  address: string;
  location?: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address, location }) => {
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
    <div className="flex flex-col items-center gap-1">
      <div className="flex items-center">
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
      
      {location && (
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <span>📍{location}</span>
        </div>
      )}
    </div>
  );
};

export default AddressDisplay;
