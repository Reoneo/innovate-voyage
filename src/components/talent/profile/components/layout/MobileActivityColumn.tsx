
import React, { useState, useEffect } from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import JobMatchingSection from '../job-matching/JobMatchingSection';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, X } from 'lucide-react';
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

  return <div className="bg-gray-50 p-3 space-y-4 h-full py-[24px] px-[5px] mx-0 my-[4px]">
      {/* Follow Button - At the top, only show if not owner */}
      {!isOwner && passport.owner_address && <FollowButton targetAddress={passport.owner_address} />}
      
      {/* All Action Buttons - Clean Professional Theme */}
      <div className="space-y-3">
        {/* Socials Button */}
        <Card onClick={() => setShowSocialsModal(true)} className="p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200 bg-white hover:bg-gray-50">
          <div className="flex items-center justify-center">
            <h3 className="text-gray-800 text-base font-light">Socials</h3>
          </div>
        </Card>

        {/* Activity Button */}
        

        {/* Job Matching Section */}
        <JobMatchingSection passport={passport} normalizedSocials={allSocials} />
      </div>

      {/* Talent Score Banner */}
      <div className="space-y-3">
        <TalentScoreBanner walletAddress={passport.owner_address} />
      </div>

      {/* GitHub Section Removed */}

      {/* Socials Modal */}
      <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="relative border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Users className="h-6 w-6 text-primary" />
              Social Links
            </DialogTitle>
            <Button variant="ghost" size="icon" className="absolute right-0 top-0 h-8 w-8" onClick={() => setShowSocialsModal(false)}>
              <X className="h-4 w-4" />
            </Button>
          </DialogHeader>
          <div className="mt-6">
            <SocialLinksSection socials={allSocials} identity={ensNameOrAddress} />
          </div>
        </DialogContent>
      </Dialog>

      {/* Activity Modal Removed */}
    </div>;
};
export default MobileActivityColumn;
