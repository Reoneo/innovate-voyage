
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { fetchUserNfts } from '@/api/services/openseaService';
import { Badge } from '@/components/ui/badge';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ walletAddress, onClick, isLoading }) => {
  const [nftCount, setNftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const getNftCount = async () => {
      try {
        const collections = await fetchUserNfts(walletAddress);
        const totalNfts = collections.reduce((total, collection) => total + collection.nfts.length, 0);
        setNftCount(totalNfts);
      } catch (error) {
        console.error("Error fetching NFT count:", error);
      } finally {
        setLoading(false);
      }
    };

    getNftCount();
  }, [walletAddress]);

  if (isLoading || loading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-white shadow-md border border-gray-200 h-full">
        <div className="flex items-center justify-center w-full">
          <div className="text-gray-700 text-lg font-semibold">NFT Collection</div>
        </div>
        <div className="text-center relative flex items-center justify-center w-full mt-2">
          <img 
            src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
            alt="NFT Collection" 
            className="h-12 w-12" 
          />
          {nftCount !== null && nftCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold px-2"
            >
              {nftCount > 99 ? '99+' : nftCount}
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
