
import React, { useState } from 'react';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { useScoresData } from '@/hooks/useScoresData';
import { NftCollectionsSection } from './nft/NftCollectionsSection';
import TallyDaoBadge from './dao/TallyDaoBadge';
import TallyDaoSection from './dao/TallyDaoSection';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { score, webacyData, txCount, loading } = useScoresData(walletAddress);
  const [showNftCollections, setShowNftCollections] = useState(false);
  const [showDaoData, setShowDaoData] = useState(false);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions' | 'nfts' | 'dao') => {
    if (type === 'nfts') {
      setShowNftCollections(true);
    } else if (type === 'dao') {
      setShowDaoData(true);
    } else {
      setActiveDialog(type);
      setDialogOpen(true);
    }
  };

  if (!walletAddress) return null;

  // Only show scores if data is available
  const showTalentScore = score !== null && score !== undefined;
  const showRiskScore = webacyData?.riskScore !== undefined && webacyData.riskScore !== null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        {showTalentScore && (
          <TalentScoreBadge 
            score={score} 
            onClick={() => handleBadgeClick('talent')}
            isLoading={loading} 
          />
        )}
        {showRiskScore && (
          <SecurityScoreBadge 
            webacyData={webacyData} 
            onClick={() => handleBadgeClick('webacy')}
            isLoading={loading} 
          />
        )}
        <TransactionsBadge 
          txCount={txCount}
          walletAddress={walletAddress}
          onClick={() => handleBadgeClick('transactions')}
          isLoading={loading} 
        />
        <TallyDaoBadge
          walletAddress={walletAddress}
          onClick={() => handleBadgeClick('dao')}
          isLoading={loading}
        />
        <Button
          variant="outline"
          className="h-auto flex flex-col items-center justify-center py-4 px-6 border bg-white shadow-sm hover:bg-gray-50 transition-colors"
          onClick={() => handleBadgeClick('nfts')}
          disabled={loading}
        >
          <div className="flex items-center justify-center mb-1">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/6699/6699362.png" 
              alt="NFT Collections"
              className="w-12 h-12"
            />
          </div>
          <span className="text-sm font-medium">NFT Collections</span>
          <span className="text-xs text-gray-500 mt-1">View NFTs</span>
        </Button>
      </div>

      <NftCollectionsSection 
        walletAddress={walletAddress} 
        showCollections={showNftCollections} 
        onOpenChange={setShowNftCollections}
      />

      <TallyDaoSection
        walletAddress={walletAddress}
        showDaoData={showDaoData}
        onOpenChange={setShowDaoData}
      />

      <ScoreDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        type={activeDialog}
        data={{
          score,
          webacyData,
          txCount,
          walletAddress
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
