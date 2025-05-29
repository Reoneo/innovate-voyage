
import React, { useEffect, useState } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ScoreBadgeProps } from './types';
import { fetchUserNfts } from '@/api/services/openseaService';
import { Badge } from '@/components/ui/badge';
import { ProfileDialog } from '@/components/profile/Profile';
import { Shield } from 'lucide-react';

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
      <div onClick={handleClick} className="cursor-pointer transition-all duration-200 hover:scale-105">
        <div className="flex flex-col items-center gap-3 p-6 bg-white rounded-2xl shadow-lg border border-gray-200 h-full">
          <div className="flex items-center justify-center w-full gap-2">
            <img src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" alt="NFT Collection" className="h-6 w-6" />
            <div className="text-gray-800 text-lg font-semibold">NFT Collection</div>
          </div>
          <div className="text-center relative flex items-center justify-center w-full">
            <div className="bg-black text-white font-bold text-4xl w-16 h-16 rounded-full flex items-center justify-center">
              {nftCount || "0"}
            </div>
            {nftCount !== null && nftCount > 0 && <Badge variant="destructive" className="absolute -top-2 right-0 min-w-6 h-6 flex items-center justify-center rounded-full text-sm font-bold px-2">
                {nftCount > 99 ? '99+' : nftCount}
              </Badge>}
          </div>
          <div className="flex items-center justify-center gap-1 text-sm text-gray-600">
            <Shield className="h-4 w-4" />
            <span>View Collection</span>
          </div>
        </div>
      </div>
      
      {/* Profile Dialog */}
      <ProfileDialog userId={mockUserId} open={showProfile} onOpenChange={setShowProfile} />
    </>;
};

export default TransactionsBadge;
