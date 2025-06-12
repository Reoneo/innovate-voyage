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

  // This is a mock UUID - in a real app you would map walletAddress to actual user UUIDs
  const mockUserId = '11111111-1111-1111-1111-111111111111';
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
  return <>
      <div onClick={handleClick} className="cursor-pointer bg-transparent">
        <div className="flex flex-col items-center gap-3 p-6 rounded-2xl h-full shadow-lg border border-gray-200 px-0 py-[10px] bg-transparent">
          <div className="text-center space-y-2">
            <h3 className="text-gray-800 py-0 my-[7px] font-semibold text-base">NFTs</h3>
            <div className="relative">
              
              {nftCount !== null && nftCount > 0 && <Badge variant="destructive" className="absolute -top-2 -right-2 min-w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold px-0 mx-[8px] my-[8px] py-0">
                  {nftCount > 99 ? '99+' : nftCount}
                </Badge>}
            </div>
            
          </div>
        </div>
      </div>
      
      {/* Profile Dialog */}
      <ProfileDialog userId={mockUserId} open={showProfile} onOpenChange={setShowProfile} />
    </>;
};
export default TransactionsBadge;