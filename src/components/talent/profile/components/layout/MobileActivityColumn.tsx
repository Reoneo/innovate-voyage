
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
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
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

      {/* Activity Modal - NFT-style Design */}
      <Dialog open={showActivityModal} onOpenChange={setShowActivityModal}>
        <DialogContent className="max-w-4xl max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl">
          <DialogHeader className="relative border-b border-gray-100 pb-6">
            <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                <Activity className="h-6 w-6 text-white" />
              </div>
              Blockchain Activity & Security
            </DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-10 w-10 rounded-full hover:bg-gray-100"
              onClick={() => setShowActivityModal(false)}
            >
              <X className="h-5 w-5" />
            </Button>
          </DialogHeader>
          
          <div className="mt-8 space-y-8">
            {/* Risk Score Section */}
            <div className="bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 border border-red-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Shield className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Security Risk Assessment</h3>
              </div>
              
              {webacyLoading ? (
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-200 rounded-lg w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                </div>
              ) : securityData ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Risk Level</p>
                    <p className="text-3xl font-bold text-red-700">
                      {Math.round(securityData.riskScore || 0)}% Risk
                    </p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">Threat Classification</p>
                    <Badge 
                      variant={securityData.threatLevel === 'LOW' ? 'secondary' : 'destructive'}
                      className="text-lg py-2 px-4 font-semibold"
                    >
                      {securityData.threatLevel || 'Unknown'}
                    </Badge>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500 text-lg">Risk data unavailable</p>
                </div>
              )}
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 border border-blue-100 rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <ArrowUpDown className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Recent Transactions</h3>
              </div>
              
              {transactions && transactions.length > 0 ? (
                <div className="space-y-4 max-h-80 overflow-y-auto">
                  {transactions.slice(0, 8).map((tx) => (
                    <div key={tx.hash} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            tx.from.toLowerCase() === passport.owner_address.toLowerCase() 
                              ? 'bg-red-500' 
                              : 'bg-green-500'
                          }`}></div>
                          <span className="font-semibold text-gray-900">
                            {tx.from.toLowerCase() === passport.owner_address.toLowerCase() ? 'Sent' : 'Received'}
                          </span>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">
                            {formatTransactionValue(tx.value)} ETH
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-4 w-4" />
                          {new Date(parseInt(tx.timeStamp) * 1000).toLocaleDateString()}
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600 mb-1">From:</p>
                          <p className="font-mono bg-gray-50 px-3 py-1 rounded-lg">{formatAddress(tx.from)}</p>
                        </div>
                        <div>
                          <p className="text-gray-600 mb-1">To:</p>
                          <p className="font-mono bg-gray-50 px-3 py-1 rounded-lg">{formatAddress(tx.to)}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ArrowUpDown className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-gray-500 text-lg">No recent transactions found</p>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileActivityColumn;
