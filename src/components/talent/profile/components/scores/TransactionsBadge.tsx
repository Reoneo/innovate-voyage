
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { fetchUserNfts } from '@/api/services/openseaService';
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

  // This is a mock UUID - in a real app you would map walletAddress to actual user UUIDs
  const mockUserId = '11111111-1111-1111-1111-111111111111';
  useEffect(() => {
    if (!walletAddress) return;
    const getNftCount = async () => {
      try {
        const collections = await fetchUserNfts(walletAddress);
        const totalNfts = collections.reduce(
          (total, collection) => total + collection.nfts.length,
          0
        );
        setNftCount(totalNfts);
      } catch (error) {
        console.error('Error fetching NFT count:', error);
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
    return <Skeleton className="h-32 w-full rounded-2xl" />;
  }
  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer group transition-transform duration-200"
      >
        <div className="flex flex-col items-center gap-2 p-6 bg-white/95 rounded-2xl shadow-md border border-gray-200 hover:shadow-lg hover:-translate-y-1 w-full min-h-[120px] transition-all">
          <div className="text-center w-full">
            <span className="text-2xl font-bold text-primary mb-2 group-hover:text-purple-600 transition-colors">
              {nftCount !== null ? `${nftCount}` : "0"}
            </span>
            <p className="text-gray-500 font-medium text-sm">
              {nftCount === 1 ? "NFT" : "NFTs"}
            </p>
          </div>
        </div>
      </div>
      {/* Profile Dialog */}
      <ProfileDialog
        userId={mockUserId}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </>
  );
};
export default TransactionsBadge;
