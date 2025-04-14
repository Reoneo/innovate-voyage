
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
  // If loading timeout occurred and still loading, show error message
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }

  // Add a style to center the content
  const centerStyle = {
    maxWidth: '950px',
    margin: '0 auto'
  };

  // Determine if we have verified skills
  const hasVerifiedSkills = passport?.skills?.some((skill: any) => skill.proof !== undefined);

  return (
    <div ref={profileRef} id="resume-pdf" style={centerStyle}>
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          {/* For mobile, use a single column layout */}
          <div className="grid grid-cols-1 gap-8">
            <div>
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
            
            <div>
              <VerifiedWorkExperience 
                walletAddress={passport.owner_address} 
              />
              
              {/* Only show skills card if we have verified skills */}
              {hasVerifiedSkills && (
                <SkillsCard
                  walletAddress={passport.owner_address}
                  skills={passport.skills || []}
                  passportId={passport.passport_id}
                />
              )}
              
              <PoapSection
                walletAddress={passport.owner_address}
              />
            </div>
          </div>
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;

// Internal component for timeout error
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
