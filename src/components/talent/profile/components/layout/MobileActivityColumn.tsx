
import React, { useState, useEffect } from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import JobMatchingSection from '../job-matching/JobMatchingSection';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, Activity, Shield, X, ArrowUpDown, Clock } from 'lucide-react';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { useWebacyData } from '@/hooks/useWebacyData';
import { useLatestTransactions } from '@/hooks/useEtherscan';

interface MobileActivityColumnProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
  normalizedSocials: Record<string, string>;
}

const MobileActivityColumn: React.FC<MobileActivityColumnProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection,
  normalizedSocials
}) => {
  const [showSocialsModal, setShowSocialsModal] = useState(false);
  const [showActivityModal, setShowActivityModal] = useState(false);
  const [allSocials, setAllSocials] = useState<Record<string, string>>(normalizedSocials);
  const [isOwner, setIsOwner] = useState(false);

  // Fetch security data and transactions
  const { securityData, isLoading: webacyLoading } = useWebacyData(passport?.owner_address);
  const { data: transactions } = useLatestTransactions(passport?.owner_address, 10);

  // Check if current user is the owner
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && passport?.owner_address && connectedWallet.toLowerCase() === passport.owner_address.toLowerCase()) {
      setIsOwner(true);
    }
  }, [passport?.owner_address]);

  // Fetch all ENS social links when component mounts
  useEffect(() => {
    const fetchAllSocials = async () => {
      if (ensNameOrAddress && (ensNameOrAddress.includes('.eth') || ensNameOrAddress.includes('.box'))) {
        try {
          const ensLinks = await getEnsLinks(ensNameOrAddress);
          if (ensLinks && ensLinks.socials) {
            setAllSocials(prevSocials => ({
              ...prevSocials,
              ...ensLinks.socials
            }));
          }
        } catch (error) {
          console.error('Error fetching ENS socials:', error);
        }
      }
    };
    fetchAllSocials();
  }, [ensNameOrAddress]);

  const formatTransactionValue = (value: string) => {
    const eth = parseFloat(value) / 1e18;
    return eth.toFixed(4);
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <div className="bg-gray-50 p-3 space-y-4 h-full py-[24px] px-[5px] mx-0 my-[4px]">
      {/* Follow Button - At the top, only show if not owner */}
      {!isOwner && passport.owner_address && (
        <FollowButton targetAddress={passport.owner_address} />
      )}
      
      {/* All Action Buttons - Clean Professional Theme */}
      <div className="space-y-3">
        {/* Socials Button */}
        <Card 
          onClick={() => setShowSocialsModal(true)} 
          className="p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 bg-white hover:bg-gray-50"
        >
          <div className="flex items-center justify-center">
            <h3 className="font-semibold text-gray-800 text-base">Socials</h3>
          </div>
        </Card>

        {/* Activity Button */}
        <Card 
          onClick={() => setShowActivityModal(true)}
          className="p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 bg-white hover:bg-gray-50"
        >
          <div className="flex items-center justify-center">
            <h3 className="font-semibold text-gray-800 text-base">Activity</h3>
          </div>
        </Card>

        {/* Job Matching Section */}
        <JobMatchingSection passport={passport} normalizedSocials={allSocials} />
      </div>

      {/* Talent Score Banner */}
      <div className="space-y-3">
        <TalentScoreBanner walletAddress={passport.owner_address} />
      </div>

      {/* GitHub Section */}
      {showGitHubSection && (
        <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <span className="text-white text-sm">⚡</span>
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">GitHub Activity</h3>
          </div>
          <GitHubContributionGraph username={githubUsername!} />
        </Card>
      )}

      {/* Socials Modal */}
      <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
        <DialogContent className="sm:max-w-md bg-white">
          <DialogHeader className="relative border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Users className="h-6 w-6 text-primary" />
              Social Links
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-8 w-8"
              onClick={() => setShowSocialsModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="mt-6">
            <SocialLinksSection socials={allSocials} identity={ensNameOrAddress} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Modal */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="relative border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Activity className="h-6 w-6 text-primary" />
              Blockchain Activity & Risk
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-8 w-8"
              onClick={() => setShowActivityModal(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          
          <div className="mt-6 space-y-6">
            {/* Risk Score Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Shield className="h-5 w-5 text-red-600" />
                Security Risk Assessment
              </h3>
              {webacyLoading ? (
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : securityData ? (
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Risk Level</p>
                    <p className="text-lg font-semibold text-red-700">
                      {Math.round(securityData.riskScore || 0)}% Risk
                    </p>
                  </div>
                  <Badge 
                    variant={securityData.threatLevel === 'low' ? 'secondary' : 'destructive'}
                    className="capitalize"
                  >
                    {securityData.threatLevel || 'Unknown'}
                  </Badge>
                </div>
              ) : (
                <p className="text-sm text-gray-500">Risk data unavailable</p>
              )}
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ArrowUpDown className="h-5 w-5 text-blue-600" />
                Recent Transactions
              </h3>
              {transactions && transactions.length > 0 ? (
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {transactions.slice(0, 5).map((tx) => (
                    <div key={tx.hash} className="bg-white rounded-lg p-3 border border-blue-100">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            tx.from.toLowerCase() === passport.owner_address.toLowerCase() 
                              ? 'bg-red-500' 
                              : 'bg-green-500'
                          }`}></div>
                          <span className="text-sm font-medium">
                            {tx.from.toLowerCase() === passport.owner_address.toLowerCase() ? 'Sent' : 'Received'}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {formatTransactionValue(tx.value)} ETH
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="text-xs text-gray-600">
                        <p>From: {formatAddress(tx.from)}</p>
                        <p>To: {formatAddress(tx.to)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">No recent transactions found</p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileActivityColumn;
