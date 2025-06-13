
import React, { useState, useEffect } from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import JobMatchingSection from '../job-matching/JobMatchingSection';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Users, Activity, Shield, Image } from 'lucide-react';
import { getEnsLinks } from '@/utils/ens/ensLinks';

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
  const [allSocials, setAllSocials] = useState<Record<string, string>>(normalizedSocials);
  const [isOwner, setIsOwner] = useState(false);

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

        {/* Activity Button Placeholder */}
        <Card className="p-4 shadow-sm border border-gray-200 bg-white opacity-75">
          <div className="flex items-center justify-center">
            <h3 className="font-medium text-gray-600 text-base">Activity</h3>
          </div>
        </Card>

        {/* Risk Button Placeholder */}
        <Card className="p-4 shadow-sm border border-gray-200 bg-white opacity-75">
          <div className="flex items-center justify-center">
            <h3 className="font-medium text-gray-600 text-base">Risk</h3>
          </div>
        </Card>

        {/* NFTs Button Placeholder */}
        <Card className="p-4 shadow-sm border border-gray-200 bg-white opacity-75">
          <div className="flex items-center justify-center">
            <h3 className="font-medium text-gray-600 text-base">NFTs</h3>
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
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Social Links
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <SocialLinksSection socials={allSocials} identity={ensNameOrAddress} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileActivityColumn;
