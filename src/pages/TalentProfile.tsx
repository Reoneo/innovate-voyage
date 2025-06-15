
import React, { Suspense, useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import TwoColumnLayout from '@/components/talent/profile/components/layout/TwoColumnLayout';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import { Helmet } from 'react-helmet-async';

const TalentProfile: React.FC = () => {
  const {
    ensNameOrAddress,
    loading,
    passport,
    avatarUrl,
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges,
    hasTalentProtocolData
  } = useProfilePage();

  useEffect(() => {
    console.log('TalentProfile: Component mounted');
    console.log('TalentProfile: ensNameOrAddress:', ensNameOrAddress);
    console.log('TalentProfile: loading:', loading);
    console.log('TalentProfile: passport:', passport);
  }, [ensNameOrAddress, loading, passport]);

  // Early return for no identifier
  if (!ensNameOrAddress) {
    console.log('TalentProfile: No ensNameOrAddress, showing not found');
    return <ProfileNotFound />;
  }

  // Loading state
  if (loading) {
    console.log('TalentProfile: Showing loading skeleton');
    return (
      <>
        <Helmet>
          <title>Loading Profile - Recruitment.box</title>
        </Helmet>
        <div className="min-h-screen bg-gray-50">
          <ProfileNavigationBar 
            connectedWallet={connectedWallet}
            onDisconnect={handleDisconnect}
            onSaveChanges={handleSaveChanges}
            avatarUrl={avatarUrl}
          />
          <ProfileSkeleton />
        </div>
      </>
    );
  }

  // No passport found
  if (!passport) {
    console.log('TalentProfile: No passport found, showing not found');
    return <ProfileNotFound />;
  }

  console.log('TalentProfile: Rendering profile for:', passport.name || ensNameOrAddress);

  const displayName = passport.name || ensNameOrAddress || 'Unknown User';
  const githubUsername = passport.socials?.github || null;
  const showGitHubSection = Boolean(githubUsername);

  try {
    return (
      <>
        <Helmet>
          <title>{displayName} - Recruitment.box</title>
          <meta name="description" content={`View ${displayName}'s professional profile on Recruitment.box`} />
        </Helmet>
        
        <div className="min-h-screen bg-gray-50" ref={profileRef}>
          <ProfileNavigationBar 
            connectedWallet={connectedWallet}
            onDisconnect={handleDisconnect}
            onSaveChanges={handleSaveChanges}
            avatarUrl={avatarUrl}
          />
          
          <main className="pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <Suspense fallback={<ProfileSkeleton />}>
                <TwoColumnLayout
                  passport={passport}
                  ensNameOrAddress={ensNameOrAddress}
                  githubUsername={githubUsername}
                  showGitHubSection={showGitHubSection}
                />
              </Suspense>
            </div>
          </main>
        </div>
      </>
    );
  } catch (error) {
    console.error('TalentProfile: Render error:', error);
    return (
      <div style={{
        padding: '20px',
        textAlign: 'center',
        fontFamily: 'sans-serif',
        background: '#f8d7da',
        color: '#721c24'
      }}>
        <h2>Profile Load Error</h2>
        <p>{error instanceof Error ? error.message : 'Unknown error loading profile'}</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    );
  }
};

export default TalentProfile;
