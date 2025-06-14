
import React, { useState } from "react";
import TalentScoreBadge from "./scores/TalentScoreBadge";
import ActivityBadge from "./scores/ActivityBadge";
import BlockchainActivityBadge from "./scores/BlockchainActivityBadge";
import ScoreDialog from "./scores/ScoreDialog";
import { useScoresData } from "@/hooks/useScoresData";
import { NftCollectionsSection } from "./nft/NftCollectionsSection";
import { useIsMobile } from "@/hooks/use-mobile";
interface TalentScoreBannerProps {
  walletAddress: string;
}
const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({
  walletAddress
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<
    "talent" | "activity" | "blockchain"
  >("talent");
  const { score, txCount, loading } = useScoresData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);
  const isMobile = useIsMobile();
  const handleBadgeClick = (
    type: "talent" | "activity" | "blockchain"
  ) => {
    setActiveDialog(type);
    setDialogOpen(true);
  };
  const handleActivityClick = () => {
    setActiveDialog("activity");
    setDialogOpen(true);
  };
  const handleNftButtonClick = () => {
    setShowNftCollections(true);
  };
  if (!walletAddress) return null;
  const showTalentScore = score !== null && score !== undefined;
  return (
    <>
      {/* First row: Blockchain Activity, Builder Score (when available) */}
      <div
        className={`${
          isMobile ? "flex flex-col gap-4" : "grid grid-cols-3 gap-6"
        } mb-6`}
      >
        <div className="transform transition-all duration-200">
          <BlockchainActivityBadge
            walletAddress={walletAddress}
            onClick={() => handleBadgeClick("blockchain")}
          />
        </div>
        {showTalentScore && (
          <div className="transform transition-all duration-200">
            <TalentScoreBadge
              score={score}
              onClick={() => handleBadgeClick("talent")}
              isLoading={loading}
              talentId={walletAddress}
            />
          </div>
        )}
        <div className="transform transition-all duration-200">
          <ActivityBadge
            txCount={txCount}
            walletAddress={walletAddress}
            onClick={handleActivityClick}
            isLoading={loading}
          />
        </div>
      </div>

      <NftCollectionsSection
        walletAddress={walletAddress}
        showCollections={showNftCollections}
        onOpenChange={setShowNftCollections}
      />

      <ScoreDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type={activeDialog}
        data={{
          score,
          txCount,
          walletAddress
        }}
      />
    </>
  );
};
export default TalentScoreBanner;
