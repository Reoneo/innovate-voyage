
import React, { useEffect, useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import ProfileSocialLinks from './social/ProfileSocialLinks';

interface ProfileInfoProps {
  name?: string;
  passportId: string;
  ownerAddress: string;
  socials: Record<string, string>;
  identity?: string;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  name,
  passportId, 
  ownerAddress, 
  socials,
  identity
}) => {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }
  }, [ownerAddress]);

  return (
    <div data-owner-address={ownerAddress}>
      <div className="mb-3">
        <CardTitle className="text-2xl">{name || passportId}</CardTitle>
      </div>
      
      <ProfileSocialLinks 
        passportId={passportId} 
        initialSocials={socials} 
      />
    </div>
  );
};

export default ProfileInfo;
