
import React from 'react';
import { Button } from '@/components/ui/button';
import { CardDescription } from '@/components/ui/card';
import { Copy } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { toast } from 'sonner';

interface AddressDisplayProps {
  address: string;
}

const AddressDisplay: React.FC<AddressDisplayProps> = ({ address }) => {
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(address);
    toast.success("Address copied to clipboard");
  };

  return (
    <CardDescription className="text-base flex items-center gap-1">
      {truncateAddress(address)}
      <Button 
        variant="ghost" 
        size="sm" 
        className="h-6 w-6 p-0" 
        onClick={copyAddressToClipboard}
      >
        <Copy className="h-3.5 w-3.5" />
      </Button>
    </CardDescription>
  );
};

export default AddressDisplay;
