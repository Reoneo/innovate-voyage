
import React from 'react';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';

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
  const copyAddressToClipboard = () => {
    navigator.clipboard.writeText(ownerAddress);
    // Toast notification removed
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
        
        <div className="flex items-center gap-1.5">
          {socialPlatforms.map((platform) => 
            socials[platform.key] && (
              <a 
                key={platform.key}
                href={socials[platform.key]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
              >
                <SocialIcon type={platform.type as any} size={18} className="text-muted-foreground hover:text-foreground" />
              </a>
            )
          )}
          {socials?.email && (
            <a 
              href={`mailto:${socials.email}`}
              className="hover:opacity-80 transition-opacity"
            >
              <SocialIcon type="mail" size={18} className="text-muted-foreground hover:text-foreground" />
            </a>
          )}
        </div>
      </div>
      
      {bio && (
        <p className="text-sm mt-1.5 text-muted-foreground">
          {bio}
        </p>
      )}
    </div>
  );
};

export default ProfileInfo;
