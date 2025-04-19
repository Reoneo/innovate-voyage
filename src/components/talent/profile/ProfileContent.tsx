
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';

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

  // A4 page style with proper dimensions (210mm × 297mm)
  const a4Style = {
    width: '210mm',
    minHeight: '297mm',
    margin: '0 auto',
    background: 'white',
    boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
    padding: '20mm',
    boxSizing: 'border-box' as const
  };

  return (
    <div className="bg-gray-50 py-8">
      <div ref={profileRef} id="resume-pdf" style={a4Style}>
        {loading && !loadingTimeout ? (
          <ProfileSkeleton />
        ) : passport ? (
          <HeaderContainer>
            <div className="grid grid-cols-1 md:grid-cols-10 gap-6 md:gap-8">
              <div className="flex flex-col gap-6 md:col-span-3">
                <AvatarSection 
                  avatarUrl={passport.avatar_url}
                  name={passport.name}
                  ownerAddress={passport.owner_address}
                  socials={passport.socials}
                  bio={passport.bio}
                  displayIdentity={ensNameOrAddress}
                  additionalEnsDomains={passport.additionalEnsDomains}
                />
              </div>
              <div className="flex flex-col gap-6 md:col-span-7">
                {/* Right column content */}
              </div>
            </div>
          </HeaderContainer>
        ) : (
          <ProfileNotFound />
        )}
      </div>
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
