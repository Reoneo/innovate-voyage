
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface NftDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nft: {
    name: string;
    imageUrl: string;
    collectionName: string;
    collectionAddress: string;
    description: string;
    tokenId: string;
    tokenType: string;
    count?: number;
  } | null;
}

const NftDetailsDialog: React.FC<NftDetailsDialogProps> = ({
  open,
  onOpenChange,
  nft
}) => {
  if (!nft) return null;

  const etherscanUrl = `https://etherscan.io/token/${nft.collectionAddress}?a=${nft.tokenId}`;
  const openseaUrl = `https://opensea.io/assets/ethereum/${nft.collectionAddress}/${nft.tokenId}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <div className="truncate">{nft.name}</div>
            {nft.count && nft.count > 1 && (
              <Badge variant="outline" className="ml-2">
                Owns {nft.count}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="rounded-md overflow-hidden bg-muted">
            {nft.imageUrl ? (
              <img
                src={nft.imageUrl}
                alt={nft.name}
                className="w-full object-cover max-h-[300px]"
              />
            ) : (
              <div className="h-[200px] flex items-center justify-center bg-muted">
                <p className="text-muted-foreground">No image available</p>
              </div>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-1">Collection</h4>
            <p className="text-sm text-muted-foreground">{nft.collectionName}</p>
          </div>

          {nft.description && (
            <div>
              <h4 className="font-medium mb-1">Description</h4>
              <p className="text-sm text-muted-foreground">{nft.description}</p>
            </div>
          )}

          <div>
            <h4 className="font-medium mb-1">Details</h4>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <p className="text-muted-foreground">Token ID</p>
                <p className="font-medium truncate">{nft.tokenId}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Token Type</p>
                <p className="font-medium">{nft.tokenType}</p>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <a
              href={etherscanUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center text-blue-600 hover:underline"
            >
              View on Etherscan <ExternalLink className="h-3 w-3 ml-1" />
            </a>
            <a
              href={openseaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs flex items-center text-blue-600 hover:underline"
            >
              View on OpenSea <ExternalLink className="h-3 w-3 ml-1" />
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NftDetailsDialog;
