
import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import ProfileBio from './ProfileBio';
import ProfileContact from './ProfileContact';
import AddressDisplay from './identity/AddressDisplay';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  bio?: string;
  ownerAddress: string;
  socials?: {
    email?: string;
    telephone?: string;
    location?: string;
    whatsapp?: string;
    [key: string]: string | undefined;
  };
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  bio, 
  ownerAddress,
  socials = {}
}) => {
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && ownerAddress && 
        connectedWallet.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    }
  }, [ownerAddress]);

  // Use WhatsApp as telephone if available and no direct telephone
  const telephone = socials.telephone || socials.whatsapp;
  
  // Check if name is likely an ENS name without the .eth extension
  const displayName = name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/) 
    ? `${name}.eth` 
    : name;
  
  return (
    <div className="flex flex-col items-center md:items-start gap-2">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <div className="mt-2 text-center md:text-left">
        <h3 className="text-lg font-semibold">{displayName}</h3>
        <AddressDisplay address={ownerAddress} />
      </div>
      <ProfileContact 
        email={socials.email}
        telephone={telephone}
        location={socials.location}
        isOwner={isOwner}
      />
      <ProfileBio 
        bio={bio}
        ownerAddress={ownerAddress}
      />
    </div>
  );
};

export default AvatarSection;
