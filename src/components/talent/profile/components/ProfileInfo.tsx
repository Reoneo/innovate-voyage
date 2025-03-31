
import React, { useEffect, useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import ProfileSocialLinks from './social/ProfileSocialLinks';

interface ProfileInfoProps {
  passportId: string;
  ownerAddress: string;
  bio?: string;
  socials: Record<string, string>;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({ 
  passportId, 
  ownerAddress, 
  bio, 
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
      
      {bio && (
        <div className="mb-4">
          <h3 className="font-bold mb-1">Bio</h3>
          <p className="text-sm text-muted-foreground">
            {bio}
          </p>
        </div>
      )}
      
      <ProfileSocialLinks 
        passportId={passportId} 
        initialSocials={socials} 
      />
    </div>
  );
};

export default ProfileInfo;
