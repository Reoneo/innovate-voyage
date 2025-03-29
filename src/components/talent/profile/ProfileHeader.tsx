
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfo from './components/ProfileInfo';
import ProfileScores from './components/ProfileScores';
import { SocialIcon } from '@/components/ui/social-icon';
import { socialPlatforms } from '@/constants/socialPlatforms';

interface ProfileHeaderProps {
  passport: {
    passport_id: string;
    owner_address: string;
    avatar_url: string;
    name: string;
    score: number;
    category: string;
    socials: {
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
      email?: string;
      facebook?: string;
      instagram?: string;
      youtube?: string;
      bluesky?: string;
      telegram?: string;
    };
    bio?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ passport }) => {
  const isMobile = useIsMobile();

  return (
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <ProfileAvatar 
            avatarUrl={passport.avatar_url} 
            name={passport.name} 
          />
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <ProfileInfo 
                passportId={passport.passport_id}
                ownerAddress={passport.owner_address}
                bio={passport.bio}
                socials={passport.socials || {}}
              />
              
              <ProfileScores 
                humanScore={passport.score}
                category={passport.category}
              />
            </div>
            
            {/* Social Icons Bar - Moved to below the profile info */}
            <div className="w-full mt-4 border-t pt-3">
              <div className="flex items-center gap-3 justify-center md:justify-start">
                {socialPlatforms.map((platform) => 
                  passport.socials[platform.key] && (
                    <a 
                      key={platform.key}
                      href={passport.socials[platform.key]} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="hover:opacity-80 transition-opacity"
                      aria-label={`Visit ${platform.key}`}
                    >
                      <SocialIcon 
                        type={platform.type as any} 
                        size={20}
                      />
                    </a>
                  )
                )}
                {passport.socials?.email && (
                  <a 
                    href={`mailto:${passport.socials.email}`}
                    className="hover:opacity-80 transition-opacity"
                    aria-label="Send email"
                  >
                    <SocialIcon type="mail" size={20} />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
