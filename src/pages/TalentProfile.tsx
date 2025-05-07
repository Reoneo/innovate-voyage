
import React, { useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import AnimatedBackground from '@/components/talent/profile/components/AnimatedBackground';
import { Helmet } from 'react-helmet-async';
import { Loader2 } from 'lucide-react';

const TalentProfile = () => {
  const { 
    ensNameOrAddress,
    loading, 
    loadingTimeout,
    passport, 
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges,
    error
  } = useProfilePage();

  useEffect(() => {
    // Set favicon to user's avatar if available
    if (passport?.avatar_url) {
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = passport.avatar_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = passport.avatar_url;
        document.head.appendChild(newLink);
      }
    }

    // Clean URL - remove timestamp query parameter
    if (window.history && window.location.href.includes('?t=')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }
  }, [passport?.avatar_url]);

  // Fallback content when loading but not timed out yet
  if (loading && !loadingTimeout && !error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <h2 className="text-xl font-medium">Loading profile for {ensNameOrAddress}...</h2>
        <p className="text-muted-foreground mt-2">This may take a moment</p>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{ensNameOrAddress || 'Profile'}</title>
        {passport?.avatar_url && (
          <>
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta property="og:image" content={passport.avatar_url} />
          </>
        )}
      </Helmet>
      <div className="min-h-screen relative">
        {/* Animated Background - now takes loading state */}
        <AnimatedBackground 
          avatarUrl={passport?.avatar_url} 
          isLoading={loading} 
        />
        
        {/* Navigation Bar */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
        />
        
        <div className="container px-1 sm:px-4 relative z-10">
          {/* Profile Content */}
          <ProfileContent 
            loading={loading}
            loadingTimeout={loadingTimeout}
            passport={passport}
            profileRef={profileRef}
            ensNameOrAddress={ensNameOrAddress}
            error={error}
          />
        </div>
      </div>
    </>
  );
};

export default TalentProfile;
