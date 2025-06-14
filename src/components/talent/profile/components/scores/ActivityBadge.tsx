import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { ScoreBadgeProps } from "./types";
import { fetchUserNfts } from "@/api/services/openseaService";
import { ProfileDialog } from "@/components/profile/Profile";

// Reusable button style for social/button matches
const buttonBaseClasses =
  "w-full flex flex-col items-center gap-2 justify-center cursor-pointer rounded-2xl border bg-white shadow-md border-gray-200 py-5 px-4 hover:shadow-lg hover:-translate-y-1 transition-all font-medium text-base min-h-[60px]";

interface ActivityBadgeProps extends ScoreBadgeProps {
  txCount: number | null;
  walletAddress: string;
}
const ActivityBadge: React.FC<ActivityBadgeProps> = ({
  walletAddress,
  onClick,
  isLoading
}) => {
  const [nftCount, setNftCount] = React.useState<number | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [showProfile, setShowProfile] = React.useState(false);
  // This is a mock UUID - in a real app you would map walletAddress to actual user UUIDs
  const mockUserId = "11111111-1111-1111-1111-111111111111";
  React.useEffect(() => {
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
        setNftCount(0);
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
    return (
      <div className={buttonBaseClasses + " animate-pulse"}>
        <span className="h-6 w-20 bg-gray-200 rounded-lg" />
        <span className="h-4 w-12 bg-gray-100 rounded" />
      </div>
    );
  }
  return (
    <>
      <div
        onClick={handleClick}
        className={buttonBaseClasses}
        style={{ fontFamily: "inherit", fontWeight: 500, fontSize: "1rem" }}
        tabIndex={0}
        title="View NFT & Activity"
      >
        <span className="text-primary text-2xl font-bold mb-1">{nftCount !== null ? nftCount : "0"}</span>
        <span style={{ fontSize: "1.02em" }}>{nftCount === 1 ? "NFT" : "NFTs"}</span>
        <span className="text-xs tracking-wide mt-1 text-gray-400 uppercase">Activity</span>
      </div>
      <ProfileDialog
        userId={mockUserId}
        open={showProfile}
        onOpenChange={setShowProfile}
      />
    </>
  );
};
export default ActivityBadge;
