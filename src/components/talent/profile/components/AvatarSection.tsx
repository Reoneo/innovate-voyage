
import React, { useEffect, useState } from 'react';
import ProfileAvatar from './ProfileAvatar';
import SocialMediaLinks from '../tabs/social/SocialMediaLinks';
import ProfileContact from './ProfileContact';
import AddressDisplay from './identity/AddressDisplay';
import { Link } from 'lucide-react';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface AvatarSectionProps {
  avatarUrl: string;
  name: string;
  ownerAddress: string;
  socials?: {
    email?: string;
    telephone?: string;
    location?: string;
    whatsapp?: string;
    [key: string]: string | undefined;
  };
  additionalEnsDomains?: string[];
  primaryDomain?: string | null;
}

const AvatarSection: React.FC<AvatarSectionProps> = ({ 
  avatarUrl, 
  name, 
  ownerAddress,
  socials = {},
  additionalEnsDomains = [],
  primaryDomain
}) => {
  const [isOwner, setIsOwner] = useState(false);
  const [enhancedSocials, setEnhancedSocials] = useState<Record<string, string>>(socials as Record<string, string>);
  const [loading, setLoading] = useState(false);
  const [ensOwnerName, setEnsOwnerName] = useState<string | null>(null);
  
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

  // Fetch ENS social links and owner name from Web3.bio
  useEffect(() => {
    const fetchEnsData = async () => {
      // Check if we have an ENS name or address
      let identity = primaryDomain || name;
      
      // Format identity for ENS lookup
      if (identity?.includes('.eth') || identity?.includes('.box')) {
        // Already formatted
      } else if (identity && !identity.includes('.') && identity.match(/^[a-zA-Z0-9]+$/)) {
        // Add .eth if simple name without extension
        identity = `${identity}.eth`;
      } else if (ownerAddress && ownerAddress.startsWith('0x')) {
        // Use address if no valid ENS name
        identity = ownerAddress;
      } else {
        return; // No valid identity to look up
      }
      
      setLoading(true);
      try {
        const profile = await fetchWeb3BioProfile(identity);
        console.log('Web3.bio profile:', profile);
        
        if (profile) {
          // Set the owner name if available
          if (profile.displayName && profile.displayName !== profile.identity) {
            setEnsOwnerName(profile.displayName);
          }
          
          const newSocials: Record<string, string> = {...(socials as Record<string, string>)};
          
          // Map profile links to social object
          if (profile.github) newSocials.github = profile.github;
          if (profile.twitter) newSocials.twitter = profile.twitter;
          if (profile.linkedin) newSocials.linkedin = profile.linkedin;
          if (profile.website) newSocials.website = profile.website;
          if (profile.facebook) newSocials.facebook = profile.facebook;
          if (profile.instagram) newSocials.instagram = profile.instagram;
          if (profile.youtube) newSocials.youtube = profile.youtube;
          if (profile.telegram) newSocials.telegram = profile.telegram;
          if (profile.discord) newSocials.discord = profile.discord;
          if (profile.bluesky) newSocials.bluesky = profile.bluesky;
          if (profile.email) newSocials.email = profile.email;
          if (profile.whatsapp) newSocials.whatsapp = profile.whatsapp;
          
          // Process links object if present
          if (profile.links) {
            if (profile.links.github?.link) newSocials.github = profile.links.github.link;
            if (profile.links.twitter?.link) newSocials.twitter = profile.links.twitter.link;
            if (profile.links.linkedin?.link) newSocials.linkedin = profile.links.linkedin.link;
            if (profile.links.website?.link) newSocials.website = profile.links.website.link;
            if (profile.links.facebook?.link) newSocials.facebook = profile.links.facebook.link;
            if (profile.links.discord?.link) newSocials.discord = profile.links.discord.link;
            
            // Handle additional links that might not be in the type definition
            const anyLinks = profile.links as any;
            if (anyLinks.instagram?.link) newSocials.instagram = anyLinks.instagram.link;
            if (anyLinks.youtube?.link) newSocials.youtube = anyLinks.youtube.link;
            if (anyLinks.telegram?.link) newSocials.telegram = anyLinks.telegram.link;
            if (anyLinks.bluesky?.link) newSocials.bluesky = anyLinks.bluesky.link;
            if (anyLinks.whatsapp?.link) newSocials.whatsapp = anyLinks.whatsapp.link;
          }
          
          console.log('Enhanced socials:', newSocials);
          setEnhancedSocials(newSocials);
        }
      } catch (error) {
        console.error('Error fetching ENS data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchEnsData();
  }, [name, ownerAddress, socials, primaryDomain]);
  
  return (
    <div className="flex flex-col items-center md:items-start gap-2">
      <ProfileAvatar 
        avatarUrl={avatarUrl} 
        name={name} 
      />
      <div className="mt-2 text-center md:text-left">
        <h3 className="text-2xl font-semibold">{ensOwnerName || displayName}</h3>
        <AddressDisplay address={ownerAddress} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <SocialMediaLinks 
            socials={enhancedSocials} 
            isLoading={loading} 
          />
        </div>
      </div>
    </div>
  );
};

export default AvatarSection;
