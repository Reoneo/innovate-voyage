
import React, { useEffect, useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import ProfileSocialLinks from './social/ProfileSocialLinks';

interface ProfileInfoProps {
  passportId: string;
  ownerAddress: string;
  socials: Record<string, string>;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  passportId, 
  ownerAddress, 
  socials 
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
        <CardTitle className="text-2xl">{passportId}</CardTitle>
      </div>
      
      <ProfileSocialLinks 
        passportId={passportId} 
        initialSocials={socials} 
      />
    </div>
  );
};

export default ProfileInfo;
