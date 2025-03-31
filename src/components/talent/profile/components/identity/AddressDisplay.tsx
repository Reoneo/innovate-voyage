
import React from 'react';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { toast } from 'sonner';

interface AddressDisplayProps {
  address: string | undefined;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address }) => {
  const copyAddressToClipboard = () => {
    if (!address) {
      toast.error("No address available to copy");
      return;
    }
    
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <div className="flex items-center gap-1">
      <span className="text-sm text-muted-foreground">
        {truncateAddress(address)}
      </span>
      {address && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0" 
          onClick={copyAddressToClipboard}
        >
          <Copy className="h-3.5 w-3.5" />
        </Button>
      )}
    </div>
  );
};

export default AddressDisplay;
