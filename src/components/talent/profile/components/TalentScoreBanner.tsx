import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import BlockchainActivityBadge from './scores/BlockchainActivityBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import { useWebacyData } from '@/hooks/useWebacyData';
import { useIsMobile } from '@/hooks/use-mobile';
interface TalentScoreBannerProps {
  walletAddress: string;
}
const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({
  walletAddress
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions' | 'blockchain'>('talent');
  const {
    score,
    txCount,
    loading
  } = useScoresData(walletAddress);
  const {
    securityData,
    isLoading: webacyLoading
  } = useWebacyData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);
  const isMobile = useIsMobile();
  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions' | 'blockchain') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };
  const handleNftButtonClick = () => {
    setShowNftCollections(true);
  };
  if (!walletAddress) return null;
  const showTalentScore = score !== null && score !== undefined;
  return <>
      {/* First row: Blockchain Activity, Risk Score, Builder Score (when available) */}
      <div className={`${isMobile ? 'flex flex-col gap-4' : 'grid grid-cols-3 gap-6'} mb-6`}>
        <div className="transform hover:scale-105 transition-all duration-200">
          <BlockchainActivityBadge walletAddress={walletAddress} onClick={() => handleBadgeClick('blockchain')} />
        </div>
        <div className="transform hover:scale-105 transition-all duration-200">
          <SecurityScoreBadge webacyData={securityData} onClick={() => handleBadgeClick('webacy')} isLoading={webacyLoading} />
        </div>
        {showTalentScore && <div className="transform hover:scale-105 transition-all duration-200">
            <TalentScoreBadge score={score} onClick={() => handleBadgeClick('talent')} isLoading={loading} talentId={walletAddress} />
          </div>}
      </div>

      {/* Second row: NFT Collection (centered) */}
      <div className="">
        <div className="transform hover:scale-105 transition-all duration-200">
          <TransactionsBadge txCount={txCount} walletAddress={walletAddress} onClick={handleNftButtonClick} isLoading={loading} />
        </div>
        {/* Empty divs to maintain grid layout */}
        <div></div>
        <div></div>
      </div>

      <NftCollectionsSection walletAddress={walletAddress} showCollections={showNftCollections} onOpenChange={setShowNftCollections} />

      <ScoreDialog open={dialogOpen} onOpenChange={setDialogOpen} type={activeDialog} data={{
      score,
      webacyData: securityData,
      txCount,
      walletAddress
    }} />
    </>;
};
export default TalentScoreBanner;