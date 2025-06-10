
import React, { useState, useEffect } from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import FarcasterCastsSection from '../farcaster/FarcasterCastsSection';
import SocialLinksSection from '../social/SocialLinksSection';
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

  // Fetch all ENS social links when component mounts
  useEffect(() => {
    const fetchAllSocials = async () => {
      if (ensNameOrAddress && (ensNameOrAddress.includes('.eth') || ensNameOrAddress.includes('.box') || ensNameOrAddress.includes('.bio'))) {
        try {
          console.log('Fetching ENS links for:', ensNameOrAddress);
          const ensLinks = await getEnsLinks(ensNameOrAddress);
          console.log('ENS links fetched:', ensLinks);
          
          if (ensLinks && ensLinks.socials) {
            // Merge ENS socials with existing socials, giving priority to ENS data
            const mergedSocials = {
              ...normalizedSocials,
              ...ensLinks.socials
            };
            console.log('Merged socials:', mergedSocials);
            setAllSocials(mergedSocials);
          }
        } catch (error) {
          console.error('Error fetching ENS socials:', error);
        }
      }
    };

    fetchAllSocials();
  }, [ensNameOrAddress, normalizedSocials]);

  // Check if we have any social links to show
  const hasSocialLinks = Object.entries(allSocials || {}).some(([key, val]) => val && val.trim() !== '');

  return (
    <div className="bg-gray-50 p-3 space-y-3">
      {/* Talent Score Banner with updated styling */}
      <div className="space-y-3">
        <TalentScoreBanner walletAddress={passport.owner_address} />
      </div>

      {/* Socials Button - First in the list - Only show if we have social links */}
      {hasSocialLinks && (
        <Card 
          className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer"
          onClick={() => setShowSocialsModal(true)}
        >
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Users className="h-4 w-4 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 text-sm">Socials</h3>
          </div>
        </Card>
      )}

      {/* Activity Button */}
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
            <Activity className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Activity</h3>
        </div>
      </Card>

      {/* Risk Button */}
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">Risk</h3>
        </div>
      </Card>

      {/* NFTs Button - Adjusted icon size to match others */}
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
            <Image className="h-4 w-4 text-white" />
          </div>
          <h3 className="font-semibold text-gray-800 text-sm">NFTs</h3>
        </div>
      </Card>

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

      {/* Farcaster - Enhanced Card */}
      <Card className="p-4 shadow-sm hover:shadow-md transition-shadow duration-200">
        <h3 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
          <span className="text-lg">💬</span>
          Farcaster
        </h3>
        <FarcasterCastsSection 
          ensName={ensNameOrAddress?.includes('.') ? ensNameOrAddress : undefined}
          address={passport.owner_address}
        />
      </Card>

      {/* Socials Modal - Now shows all ENS social links */}
      <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Social Links
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            {hasSocialLinks ? (
              <SocialLinksSection socials={allSocials} identity={ensNameOrAddress} />
            ) : (
              <p className="text-sm text-gray-500 text-center py-4">No social links available</p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MobileActivityColumn;
