
import React, { useEffect, useState, Suspense } from 'react';
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
  
  const [initialRender, setInitialRender] = useState(true);
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  
  // Optimize initial loading by removing timeout after first successful load
  useEffect(() => {
    if (!loading && initialRender) {
      setInitialRender(false);
    }
  }, [loading, initialRender]);

  // Track how long the page has been loading
  useEffect(() => {
    let timer: number;
    if (loading) {
      timer = window.setInterval(() => {
        setTimeElapsed(prev => prev + 1);
      }, 1000);
    } else {
      setTimeElapsed(0);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [loading]);

  // Show partial content after 5 seconds even if still loading
  const showPartialContent = timeElapsed > 5;

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
    
    // Display loading message in console
    if (loading) {
      console.log(`Loading profile data for ${ensNameOrAddress}...`);
    } else {
      console.log(`Profile data loaded for ${ensNameOrAddress}`);
    }
  }, [passport?.avatar_url, loading, ensNameOrAddress]);

  // Prefetch avatar for better loading experience
  useEffect(() => {
    if (passport?.avatar_url) {
      const img = new Image();
      img.src = passport.avatar_url;
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
          {(loading && !showPartialContent) ? (
            /* Show skeleton while loading - now with proper padding */
            <div className="pt-16">
              <ProfileSkeleton />
              {loadingTimeout && (
                <div className="text-center mt-4 p-2 bg-amber-50 border border-amber-200 rounded-md">
                  <p className="text-amber-700">Taking longer than usual to load...</p>
                </div>
              )}
            </div>
          ) : (
            /* Show actual content when loaded or after timeout */
            <Suspense fallback={<div className="pt-16"><ProfileSkeleton /></div>}>
              <ProfileContent 
                loading={loading && showPartialContent}
                loadingTimeout={loadingTimeout}
                passport={passport}
                profileRef={profileRef}
                ensNameOrAddress={ensNameOrAddress}
              />
            </Suspense>
          )}
        </div>
      </div>
    </>
  );
};

export default TalentProfile;
