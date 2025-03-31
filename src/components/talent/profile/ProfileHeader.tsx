
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import AvatarSection from './components/AvatarSection';
import ProfileInfoSection from './components/ProfileInfoSection';
import ProfileScores from './components/ProfileScores';

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
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 w-full">
        <AvatarSection 
          avatarUrl={passport.avatar_url}
          name={passport.name}
          ownerAddress={passport.owner_address}
          socials={passport.socials}
        />
        <div className="flex-1 flex flex-col md:flex-row justify-between w-full">
          <ProfileInfoSection
            passportId={passport.passport_id}
            ownerAddress={passport.owner_address}
            bio={passport.bio}
            socials={passport.socials}
          />
          <div className="mt-4 md:mt-0">
            <ProfileScores
              category={passport.category}
            />
          </div>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileHeader;
