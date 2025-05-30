
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';
import TallyDialogContent from './TallyDialogContent';

interface TallyInsightsSectionProps {
  walletAddress: string;
}

const TallyInsightsSection: React.FC<TallyInsightsSectionProps> = ({
  walletAddress
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const {
    tallyData,
    isLoading,
    error
  } = useTallyData(walletAddress);

  if (!walletAddress) return null;

  const handleOpenDialog = () => {
    setDialogOpen(true);
  };

  const renderSummaryContent = () => {
    if (isLoading) {
      return (
        <div className="space-y-3">
          <Skeleton className="h-6 w-3/4" />
          <Skeleton className="h-10 w-1/2" />
          <Skeleton className="h-4 w-full" />
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-2">
          <p className="text-red-500 text-sm">Error loading governance data</p>
        </div>
      );
    }

    if (!tallyData) {
      return (
        <div className="text-center py-2">
          <p className="text-muted-foreground text-sm">No governance data found</p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        <div className="flex items-center">
          <img 
            src={tallyData.governorInfo.iconUrl || "https://assets.tally.xyz/tally-logo.svg"} 
            alt={tallyData.governorInfo.name} 
            className="h-8 w-8 mr-3 rounded-md" 
          />
          <div>
            <h3 className="font-medium">{tallyData.governorInfo.name}</h3>
            <p className="text-sm text-muted-foreground">{tallyData.governorInfo.symbol}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">Voting Power</p>
            <p className="text-lg font-bold">{tallyData.votingInfo.votingPower || "0"}</p>
          </div>
          
          <div className="p-3 bg-purple-50 rounded-lg">
            <p className="text-xs text-purple-600 mb-1">Delegations</p>
            <p className="text-lg font-bold">
              {tallyData.votingInfo.receivedDelegations ? "Yes" : "None"}
            </p>
          </div>
        </div>
        
        {tallyData.votingInfo.recentVotes && tallyData.votingInfo.recentVotes.length > 0 && (
          <div>
            <p className="text-xs text-muted-foreground mb-1">Latest vote:</p>
            <p className="text-sm font-medium truncate">
              {tallyData.votingInfo.recentVotes[0].proposalTitle}
            </p>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      <Card className="p-6 hover:shadow-lg transition-all duration-200 cursor-pointer" onClick={handleOpenDialog}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <img 
              src="https://assets.tally.xyz/tally-logo.svg" 
              alt="Tally" 
              className="h-6 w-6" 
            />
            <h2 className="text-lg font-semibold">Governance Activity</h2>
          </div>
          <Button variant="ghost" size="sm">
            View Details
          </Button>
        </div>
        
        {renderSummaryContent()}
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Tally Governance</DialogTitle>
          </DialogHeader>
          <TallyDialogContent walletAddress={walletAddress} />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default TallyInsightsSection;
