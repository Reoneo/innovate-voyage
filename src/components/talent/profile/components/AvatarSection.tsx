
import React, { useState, useEffect } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileContact from './ProfileContact';
import NameSection from './identity/NameSection';
import AdditionalEnsDomains from './identity/AdditionalEnsDomains';
import SocialLinksSection from './social/SocialLinksSection';
import FollowButton from './identity/FollowButton';
import PoapSection from './poap/PoapSection';
import { getEnsLinks } from '@/utils/ens/ensLinks';
import { Badge } from '@/components/ui/badge';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  ownerAddress: string;
  socials?: Record<string, string>;
  additionalEnsDomains?: string[];
  bio?: string;
  displayIdentity?: string;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  ownerAddress,
  socials = {},
  additionalEnsDomains = [],
  bio,
  displayIdentity
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [ensBio, setEnsBio] = useState<string>('');
  const [ensKeywords, setEnsKeywords] = useState<string[]>([]);
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && ownerAddress && 
        connectedWallet.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    }
  }, [ownerAddress]);

  useEffect(() => {
    // Fetch ENS bio and keywords
    if (displayIdentity && (displayIdentity.includes('.eth') || displayIdentity.includes('.box'))) {
      getEnsLinks(displayIdentity)
        .then(links => {
          if (links?.description && typeof links.description === 'string') {
            setEnsBio(links.description);
          }
          if (links?.keywords) {
            setEnsKeywords(Array.isArray(links.keywords) ? links.keywords : [links.keywords]);
          }
        })
        .catch(error => {
          console.error(`Error fetching ENS data for ${displayIdentity}:`, error);
        });
    }
  }, [displayIdentity]);
  
  // Format socials object to ensure all keys are lowercase for consistency
  const normalizedSocials: Record<string, string> = {};
  Object.entries(socials || {}).forEach(([key, value]) => {
    if (value && typeof value === 'string' && value.trim() !== '') {
      normalizedSocials[key.toLowerCase()] = value;
    }
  });

  // Use WhatsApp as telephone if available and no direct telephone
  const telephone = normalizedSocials.telephone || normalizedSocials.whatsapp;
  
  return (
    <div className="flex flex-col items-center gap-2 w-full text-center">
      {/* Avatar */}
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      
      {/* Name and Address */}
      <NameSection 
        name={name} 
        ownerAddress={ownerAddress}
        displayIdentity={displayIdentity}
      />
      
      {/* Additional ENS Domains */}
      <AdditionalEnsDomains domains={additionalEnsDomains} />
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        isOwner={isOwner}
      />
      
      {/* Follow Button */}
      {!isOwner && ownerAddress && (
        <div className="mb-3">
          <FollowButton targetAddress={ownerAddress} />
        </div>
      )}
      
      {/* ENS Bio */}
      {ensBio && (
        <div className="mb-3">
          <p className="text-sm text-muted-foreground">{ensBio}</p>
          {/* ENS Keywords */}
          {ensKeywords.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2 justify-center">
              {ensKeywords.map((keyword, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}
        </div>
      )}
      
      {/* Social Links */}
      <SocialLinksSection socials={normalizedSocials} identity={displayIdentity} />
      
      {/* POAP Section */}
      <div className="mt-4 w-full">
        <PoapSection walletAddress={ownerAddress} />
      </div>
    </div>
  );
};

export default AvatarSection;
