
import React, { useEffect, useState } from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';
import { toast } from 'sonner';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

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
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>(socials || {});
  const [loading, setLoading] = useState(false);

  // Fetch ENS social links directly from web3.bio if needed
  useEffect(() => {
    const fetchSocialLinks = async () => {
      // Only fetch if we have an ENS name
      if (passportId?.includes('.eth') || passportId?.includes('.box')) {
        setLoading(true);
        try {
          console.log("Fetching social links for", passportId);
          const profile = await fetchWeb3BioProfile(passportId);
          
          if (profile) {
            console.log("Received profile:", profile);
            const newSocials: Record<string, string> = {};
            
            // Direct properties from the profile
            if (profile.github) newSocials.github = profile.github;
            if (profile.twitter) newSocials.twitter = profile.twitter;
            if (profile.linkedin) newSocials.linkedin = profile.linkedin;
            if (profile.website) newSocials.website = profile.website;
            if (profile.facebook) newSocials.facebook = profile.facebook;
            if (profile.instagram) newSocials.instagram = profile.instagram;
            if (profile.youtube) newSocials.youtube = profile.youtube;
            if (profile.telegram) newSocials.telegram = profile.telegram;
            if (profile.bluesky) newSocials.bluesky = profile.bluesky;
            if (profile.email) newSocials.email = profile.email;
            
            // Also check the links object if available
            if (profile.links) {
              if (profile.links.website?.link) newSocials.website = profile.links.website.link;
              if (profile.links.github?.link) newSocials.github = profile.links.github.link;
              if (profile.links.twitter?.link) newSocials.twitter = profile.links.twitter.link;
              if (profile.links.linkedin?.link) newSocials.linkedin = profile.links.linkedin.link;
              if (profile.links.facebook?.link) newSocials.facebook = profile.links.facebook.link;
              
              // Use type assertion for properties that might not be in the type definition
              const anyLinks = profile.links as any;
              if (anyLinks.instagram?.link) newSocials.instagram = anyLinks.instagram.link;
              if (anyLinks.youtube?.link) newSocials.youtube = anyLinks.youtube.link;
              if (anyLinks.telegram?.link) newSocials.telegram = anyLinks.telegram.link;
              if (anyLinks.bluesky?.link) newSocials.bluesky = anyLinks.bluesky.link;
            }
            
            console.log("Mapped social links:", newSocials);
            
            // Only update if we found any links
            if (Object.keys(newSocials).length > 0) {
              setSocialLinks(prevLinks => ({
                ...prevLinks,
                ...newSocials
              }));
            }
          }
        } catch (error) {
          console.error("Error fetching social links:", error);
        } finally {
          setLoading(false);
        }
      }
    };
    
    fetchSocialLinks();
  }, [passportId]);

  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(ownerAddress);
    toast.success("Address copied to clipboard");
  };

  return (
    <div>
      <CardTitle className="text-2xl">{passportId}</CardTitle>
      <div className="flex items-center gap-2">
        <CardDescription className="text-base flex items-center gap-1">
          {truncateAddress(ownerAddress)}
          <Button 
            variant="ghost" 
            size="sm" 
            className="h-6 w-6 p-0" 
            onClick={copyAddressToClipboard}
          >
            <Copy className="h-3.5 w-3.5" />
          </Button>
        </CardDescription>
      </div>
      
      {/* Social Icons in a horizontal row immediately under the wallet address */}
      <div className="mt-2 flex flex-wrap items-center gap-3 border-t border-border pt-2">
        {socialPlatforms.map((platform) => 
          socialLinks[platform.key] && (
            <a 
              key={platform.key}
              href={socialLinks[platform.key]} 
              target="_blank" 
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
              aria-label={`Visit ${platform.key}`}
            >
              <SocialIcon 
                type={platform.type as any} 
                size={20}
              />
            </a>
          )
        )}
        {socialLinks?.email && (
          <a 
            href={`mailto:${socialLinks.email}`}
            className="hover:opacity-80 transition-opacity bg-secondary/30 p-1.5 rounded-full"
            aria-label="Send email"
          >
            <SocialIcon type="mail" size={20} />
          </a>
        )}
        
        {Object.keys(socialLinks).length === 0 && !loading && (
          <span className="text-sm text-muted-foreground">No social links available</span>
        )}
        
        {loading && (
          <span className="text-sm text-muted-foreground">Loading social links...</span>
        )}
      </div>
      
      {bio && (
        <p className="text-sm mt-3 text-muted-foreground">
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileInfo;
