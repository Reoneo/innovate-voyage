
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { fetchUserNfts } from '@/api/services/openseaService';
import { Badge } from '@/components/ui/badge';
import { ProfileDialog } from '@/components/profile/Profile';

interface TransactionsBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
}

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({
  walletAddress,
  onClick,
  isLoading
}) => {
  const [nftCount, setNftCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [showProfile, setShowProfile] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // This is a mock UUID - in a real app you would map walletAddress to actual user UUIDs
  const mockUserId = '11111111-1111-1111-1111-111111111111';

  useEffect(() => {
    if (!walletAddress) return;

    const getNftCount = async () => {
      try {
        setError(null);
        console.log(`Fetching NFT count for wallet: ${walletAddress}`);
        
        const collections = await fetchUserNfts(walletAddress);
        const totalNfts = collections.reduce((total, collection) => total + collection.nfts.length, 0);
        
        console.log(`Found ${totalNfts} total NFTs across ${collections.length} collections`);
        setNftCount(totalNfts);
      } catch (error) {
        console.error("Error fetching NFT count:", error);
        setError(error instanceof Error ? error.message : 'Failed to fetch NFTs');
        setNftCount(0); // Set to 0 instead of null on error
      } finally {
        setLoading(false);
      }
    };

    getNftCount();
  }, [walletAddress]);

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else {
      setShowProfile(true);
    }
  };

  if (isLoading || loading) {
    return <Skeleton className="h-24 w-full rounded-2xl" />;
  }

  return (
    <>
      <button
        onClick={handleClick}
        className="flex flex-col items-center justify-center w-full h-24 rounded-2xl bg-transparent transition-all p-0 border-0 outline-none gap-2 hover:bg-gray-50"
        style={{ minWidth: 0 }}
        type="button"
      >
        <div className="text-lg font-semibold text-gray-900 mb-1">NFTs</div>
        <div className="relative">
          {nftCount !== null && nftCount > 0 && (
            <Badge variant="destructive" className="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold px-0 mx-[8px] my-[8px] py-0">
              {nftCount > 99 ? '99+' : nftCount}
            </Badge>
          )}
          {error && (
            <Badge variant="secondary" className="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center rounded-full text-xs font-bold px-1">
              !
            </Badge>
          )}
        </div>
        <div className="text-xs text-gray-600 -mt-1">
          {error ? 'Error loading' : 'Collections'}
        </div>
      </button>
      {/* Profile Dialog */}
      <ProfileDialog userId={mockUserId} open={showProfile} onOpenChange={setShowProfile} />
    </>
  );
};

export default TransactionsBadge;
