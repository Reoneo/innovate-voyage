
import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import SocialMediaLinks from '../tabs/social/SocialMediaLinks';
import ProfileContact from './ProfileContact';
import AddressDisplay from './identity/AddressDisplay';
import { Link } from 'lucide-react';

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
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        <AddressDisplay address={ownerAddress} />
      </div>
      <ProfileContact 
        email={socials.email}
        telephone={telephone}
        location={socials.location}
        isOwner={isOwner}
      />
      
      <div className="w-full mt-6">
        <h3 className="flex items-center gap-2 text-xl font-medium mb-4">
          <Link className="h-5 w-5" /> Social Links
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3">
          <SocialMediaLinks socials={socials as Record<string, string>} />
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
