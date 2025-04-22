
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import VerifiedWorkExperience from './components/VerifiedWorkExperience';
import PoapSection from './components/poap/PoapSection';
import TalentScoreBanner from './components/TalentScoreBanner';

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

  const centerStyle = {
    maxWidth: '950px',
    margin: '0 auto'
  };

  return (
    <div ref={profileRef} id="resume-pdf" style={centerStyle}>
      {loading && !loadingTimeout ? (
        <ProfileSkeleton />
      ) : passport ? (
        <HeaderContainer>
          <div className="grid grid-cols-1 md:grid-cols-10 gap-8">
            {/* Left column with avatar and info */}
            <div className="md:col-span-3">
              <div className="flex flex-col items-center">
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
            </div>
            
            {/* Right column with scoring information and other sections */}
            <div className="md:col-span-7">
              {/* Score Badges Section */}
              <TalentScoreBanner walletAddress={passport.owner_address} />
              
              {/* Work Experience - No borders */}
              <div className="rounded-xl bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-[0_2px_10px_#3f397cee] p-0 mt-4">
                <VerifiedWorkExperience walletAddress={passport.owner_address} />
              </div>
              
              {/* POAP Section - No borders, futuristic style */}
              <div className="mt-4">
                <PoapSection walletAddress={passport.owner_address} />
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
