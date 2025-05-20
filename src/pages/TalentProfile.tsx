
import React, { useEffect, useState } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import AnimatedBackground from '@/components/talent/profile/components/AnimatedBackground';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import { Helmet } from 'react-helmet-async';

const TalentProfile = () => {
  const { 
    ensNameOrAddress,
    loading, 
    loadingTimeout,
    passport, 
    profileRef,
    connectedWallet,
    handleDisconnect,
    handleSaveChanges
  } = useProfilePage();
  
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Show content much faster - reduce initial wait time
  useEffect(() => {
    if (loading) {
      const timer = setTimeout(() => {
        setShowSkeleton(false);
      }, 800); // Show partial content after just 800ms even if still loading
      
      return () => clearTimeout(timer);
    } else {
      setShowSkeleton(false);
    }
  }, [loading]);

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
    
    // Prefetch placeholder avatar for faster fallbacks
    const placeholderImg = new Image();
    placeholderImg.src = "/placeholder.svg";
  }, [passport?.avatar_url]);

  return (
    <>
      <Helmet>
        <title>{ensNameOrAddress || 'Profile'}</title>
        {passport?.avatar_url && (
          <>
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <link rel="preload" href={passport.avatar_url} as="image" />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta property="og:image" content={passport.avatar_url} />
          </>
        )}
      </Helmet>
      <div className="min-h-screen relative bg-transparent">
        {/* Always show the AnimatedBackground */}
        <AnimatedBackground 
          avatarUrl={passport?.avatar_url} 
          isLoading={false} 
        />
        
        {/* Always show Navigation Bar */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
        />
        
        <div className="container px-1 sm:px-4 relative z-10">
          {showSkeleton ? (
            /* Show skeleton while loading - now with proper padding */
            <div className="pt-16">
              <ProfileSkeleton />
            </div>
          ) : (
            /* Show actual content when loaded or after timeout */
            <ProfileContent 
              loading={loading}
              loadingTimeout={loadingTimeout}
              passport={passport}
              profileRef={profileRef}
              ensNameOrAddress={ensNameOrAddress}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default TalentProfile;
