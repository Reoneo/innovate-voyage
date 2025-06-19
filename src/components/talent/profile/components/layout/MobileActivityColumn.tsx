
import React, { useState, useEffect } from 'react';
import TalentScoreBanner from '../TalentScoreBanner';
import SocialLinksSection from '../social/SocialLinksSection';
import FollowButton from '../identity/FollowButton';
import JobMatchingSection from '../job-matching/JobMatchingSection';
import { Card } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Users, X, Briefcase, Star, MessageCircle } from 'lucide-react';
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

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  return (
    <div className="space-y-4">
      {/* Follow Button - Professional Style */}
      {!isOwner && passport.owner_address && (
        <Card className="p-4 border border-gray-200 bg-white">
          <FollowButton targetAddress={passport.owner_address} />
        </Card>
      )}
      
      {/* Professional Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Professional Network Card */}
        <Card 
          onClick={() => setShowSocialsModal(true)} 
          className="p-4 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Professional Network</h3>
              <p className="text-xs text-gray-500">View social profiles</p>
            </div>
          </div>
        </Card>

        {/* Messages Card */}
        <Card 
          onClick={handleOpenXmtpModal} 
          className="p-4 border border-gray-200 bg-white hover:bg-gray-50 cursor-pointer transition-all duration-200 hover:shadow-md"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-50 rounded-lg">
              <MessageCircle className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Direct Message</h3>
              <p className="text-xs text-gray-500">Send a message</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Professional Score Section */}
      <Card className="p-4 border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-purple-50 rounded-lg">
            <Star className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Professional Score</h3>
            <p className="text-xs text-gray-500">Blockchain reputation</p>
          </div>
        </div>
        <TalentScoreBanner walletAddress={passport.owner_address} />
      </Card>

      {/* Job Matching Section */}
      <Card className="p-4 border border-gray-200 bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-orange-50 rounded-lg">
            <Briefcase className="h-5 w-5 text-orange-600" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">Career Opportunities</h3>
            <p className="text-xs text-gray-500">Find matching positions</p>
          </div>
        </div>
        <JobMatchingSection passport={passport} normalizedSocials={allSocials} />
      </Card>

      {/* Professional Network Modal */}
      <Dialog open={showSocialsModal} onOpenChange={setShowSocialsModal}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-white">
          <DialogHeader className="relative border-b pb-4">
            <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
              <Users className="h-6 w-6 text-primary" />
              Professional Network
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
    </div>
  );
};

export default MobileActivityColumn;
