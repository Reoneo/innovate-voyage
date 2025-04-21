
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import VerifiedWorkExperience from './components/VerifiedWorkExperience';
import SkillsCard from './components/SkillsCard';
import PoapSection from './components/poap/PoapSection';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  loading, 
  loadingTimeout,
  passport, 
  profileRef,
  ensNameOrAddress
}) => {
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }

  return (
    <div ref={profileRef} id="resume-pdf">
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="flex flex-col md:flex-row md:gap-8">
            {/* Left column - Avatar and social info */}
            <div className="w-full md:w-1/3 mb-8 md:mb-0">
              <AvatarSection 
                avatarUrl={passport.avatar_url}
                name={passport.name}
                ownerAddress={passport.owner_address}
                socials={{
                  ...passport.socials,
                  linkedin: passport.socials.linkedin ? passport.socials.linkedin : undefined
                }}
                bio={passport.bio}
                displayIdentity={ensNameOrAddress}
                additionalEnsDomains={passport.additionalEnsDomains}
              />
            </div>
            
            {/* Right column - Experience, skills, POAPs */}
            <div className="w-full md:w-2/3">
              <div className="space-y-6">
                <VerifiedWorkExperience 
                  walletAddress={passport.owner_address} 
                />
                
                <SkillsCard
                  walletAddress={passport.owner_address}
                  skills={passport.skills || []}
                />
                
                <PoapSection
                  walletAddress={passport.owner_address}
                />
              </div>
            </div>
          </div>
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

const ProfileTimeoutError: React.FC<{ensNameOrAddress?: string}> = ({ ensNameOrAddress }) => (
  <div className="min-h-screen bg-gray-50 py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. The request timed out.
          </p>
        </div>
      </HeaderContainer>
    </div>
  </div>
);

export default ProfileContent;
