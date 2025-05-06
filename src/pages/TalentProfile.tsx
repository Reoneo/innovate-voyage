
import React, { useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import AnimatedBackground from '@/components/talent/profile/components/AnimatedBackground';
import { Helmet } from 'react-helmet-async';
import { AlertCircle } from 'lucide-react';

const TalentProfile = () => {
  const { 
    ensNameOrAddress,
    loading, 
    loadingTimeout,
    error,
    passport, 
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges
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
        {/* Animated Background - now takes loading state and error */}
        <AnimatedBackground 
          avatarUrl={passport?.avatar_url} 
          isLoading={loading} 
          hasError={!!error}
        />
        
        {/* Navigation Bar */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
        />
        
        <div className="container px-1 sm:px-4 relative z-10">
          {/* Error display */}
          {error && (
            <div className="mt-20 bg-red-50 border border-red-200 rounded-xl p-4 shadow-md">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />
                <div>
                  <h3 className="font-medium text-red-800">Error Loading Profile</h3>
                  <p className="text-red-600 text-sm">{error}</p>
                  <p className="text-sm mt-2">
                    Try refreshing the page or checking that the ENS name or address is correct.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {/* Profile Content */}
          <ProfileContent 
            loading={loading}
            loadingTimeout={loadingTimeout}
            error={error}
            passport={passport}
            profileRef={profileRef}
            ensNameOrAddress={ensNameOrAddress}
          />
        </div>
      </div>
    </>
  );
};

export default TalentProfile;
