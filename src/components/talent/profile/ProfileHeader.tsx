
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import AvatarSection from './components/AvatarSection';
import ProfileInfoSection from './components/ProfileInfoSection';

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
      discord?: string;
      telephone?: string;
      location?: string;
    };
    bio?: string;
  };
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ passport }) => {
  return (
    <HeaderContainer>
      <div className="flex flex-col items-center gap-4 w-full max-w-full overflow-hidden">
        <AvatarSection 
          avatarUrl={passport.avatar_url}
          name={passport.name}
          ownerAddress={passport.owner_address}
          socials={passport.socials}
          bio={passport.bio}
        />
        <div className="w-full max-w-full">
          <ProfileInfoSection
            passportId={passport.passport_id}
            ownerAddress={passport.owner_address}
            bio={passport.bio}
            socials={passport.socials}
          />
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileHeader;
