
import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import SocialMediaLinks from '../tabs/social/SocialMediaLinks';
import ProfileContact from './ProfileContact';
import AddressDisplay from './identity/AddressDisplay';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'lucide-react';

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
  
  useEffect(() => {
    const connectedWallet = localStorage.getItem('connectedWalletAddress');
    if (connectedWallet && ownerAddress && 
        connectedWallet.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    }
  }, [ownerAddress]);

  // Determine display name - prefer displayIdentity (URL slug) over name
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/) 
    ? `${name}.eth` 
    : name);
  
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
    <div className="flex flex-col items-center md:items-start gap-2">
      {/* Avatar and Name section */}
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <div className="mt-2 text-center md:text-left">
        <h3 className="text-2xl font-semibold">{displayName}</h3>
        <div className="flex items-center gap-2 mt-1">
          <AddressDisplay address={ownerAddress} />
        </div>
      </div>
      
      {/* Additional ENS Domains */}
      {additionalEnsDomains && additionalEnsDomains.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2 max-w-full">
          {additionalEnsDomains.map((domain, index) => (
            <a 
              key={index}
              href={`https://app.ens.domains/name/${domain}`}
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-muted hover:bg-muted/80 transition-colors text-xs"
            >
              <Avatar className="h-4 w-4">
                <AvatarImage src={`https://metadata.ens.domains/mainnet/avatar/${domain}`} alt={domain} />
                <AvatarFallback>{domain.substring(0, 1).toUpperCase()}</AvatarFallback>
              </Avatar>
              {domain}
            </a>
          ))}
        </div>
      )}
      
      {/* Contact Info */}
      <ProfileContact 
        email={normalizedSocials.email}
        telephone={telephone}
        location={normalizedSocials.location}
        isOwner={isOwner}
      />
      
      {/* ENS Bio */}
      {bio && (
        <div className="w-full mt-4 mb-2 text-sm">
          <h3 className="text-xl font-medium mb-2">Bio</h3>
          <p className="text-muted-foreground whitespace-pre-wrap break-words">{bio}</p>
        </div>
      )}
      {!bio && (
        <div className="w-full mt-4 mb-2 text-sm">
          <h3 className="text-xl font-medium mb-2">Bio</h3>
          <p className="text-muted-foreground italic">No bio available</p>
        </div>
      )}
      
      {/* Social Links */}
      <div className="w-full mt-6">
        <h3 className="flex items-center gap-2 text-xl font-medium mb-4">
          <Link className="h-5 w-5" /> Social Links
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <SocialMediaLinks socials={normalizedSocials} />
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
