
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import ProfileAvatar from './components/ProfileAvatar';
import ProfileInfo from './components/ProfileInfo';
import ProfileBio from './components/ProfileBio';

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
          <div className="flex flex-col items-center gap-2">
            <ProfileAvatar 
              avatarUrl={passport.avatar_url} 
              name={passport.name} 
            />
            <ProfileBio 
              bio={passport.bio}
              ownerAddress={passport.owner_address}
            />
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
              <ProfileInfo 
                passportId={passport.passport_id}
                ownerAddress={passport.owner_address}
                bio={passport.bio}
                socials={passport.socials || {}}
              />
            </div>
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default ProfileHeader;
