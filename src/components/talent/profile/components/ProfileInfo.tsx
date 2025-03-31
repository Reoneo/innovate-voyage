
import React, { useEffect, useState } from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { PencilLine } from 'lucide-react';
import ProfileSocialLinks from './social/ProfileSocialLinks';
import EditableName from './identity/EditableName';
import AddressDisplay from './identity/AddressDisplay';

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
      <div className="flex items-center gap-3 mb-1">
        <CardTitle className="text-2xl">{passportId}</CardTitle>
      </div>
      
      <div className="flex items-center flex-wrap gap-2">
        <EditableName 
          ownerAddress={ownerAddress} 
          isOwner={isOwner} 
        />
        <AddressDisplay address={ownerAddress} />
      </div>
      
      <ProfileSocialLinks 
        passportId={passportId} 
        initialSocials={socials} 
      />
      
      {bio && (
        <p className="text-sm mt-3 text-muted-foreground">
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileInfo;
