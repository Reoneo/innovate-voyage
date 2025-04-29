
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { fetchUserNfts } from '@/api/services/openseaService';

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
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-300/20 to-blue-100/10 h-full">
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
              alt="NFT Collection" 
              className="h-8 w-8"
            />
          </div>
          <div className="text-3xl font-bold text-blue-600">{nftCount || '0'}</div>
          <p className="text-sm text-gray-600">NFTs</p>
        </div>
      </div>
    </div>
  );
};

export default TransactionsBadge;
