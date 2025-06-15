
import React, { useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import AnimatedBackground from '@/components/talent/profile/components/AnimatedBackground';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import { Helmet } from 'react-helmet-async';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    // Log loading progress for debugging
    console.log('Profile loading state:', { 
      ensNameOrAddress, 
      loading, 
      loadingTimeout, 
      hasPassport: !!passport 
    });
    
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
      
      // Update apple touch icons
      const appleTouchIcons = document.querySelectorAll("link[rel*='apple-touch-icon']");
      appleTouchIcons.forEach((icon) => {
        (icon as HTMLLinkElement).href = passport.avatar_url;
      });
    }

    // Clean URL - remove timestamp query parameter
    if (window.history && window.location.href.includes('?t=')) {
      const cleanUrl = window.location.pathname;
      window.history.replaceState({}, document.title, cleanUrl);
    }

    // Set viewport on mobile to prevent zooming, without disabling scroll globally
    if (isMobile) {
      // Set viewport to prevent zooming
      let viewport = document.querySelector('meta[name="viewport"]');
      if (!viewport) {
        viewport = document.createElement('meta');
        viewport.setAttribute('name', 'viewport');
        document.head.appendChild(viewport);
      }
      viewport.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
    }

    return () => {
      // Reset viewport when component unmounts
      if (!isMobile) {
        const viewport = document.querySelector('meta[name="viewport"]');
        if (viewport) {
          viewport.setAttribute('content', 'width=device-width, initial-scale=1.0');
        }
      }
    };
  }, [passport?.avatar_url, ensNameOrAddress, loading, loadingTimeout, isMobile]);

  return (
    <>
      <Helmet>
        <title>{ensNameOrAddress || 'Profile'} | Recruitment.box</title>
        <meta name="description" content={`Profile of ${ensNameOrAddress || 'Web3 user'} on Recruitment.box - Decentralized CV & Recruitment Engine`} />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
        {passport?.avatar_url && (
          <>
            <link rel="icon" href={passport.avatar_url} type="image/png" />
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <link rel="apple-touch-icon" sizes="152x152" href={passport.avatar_url} />
            <link rel="apple-touch-icon" sizes="180x180" href={passport.avatar_url} />
            <link rel="apple-touch-icon" sizes="167x167" href={passport.avatar_url} />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta property="og:image" content={passport.avatar_url} />
            <meta property="og:title" content={`${ensNameOrAddress || 'Profile'} | Recruitment.box`} />
            <meta property="og:description" content={`Profile of ${ensNameOrAddress || 'Web3 user'} on Recruitment.box`} />
            <meta name="twitter:image" content={passport.avatar_url} />
            <meta name="twitter:title" content={`${ensNameOrAddress || 'Profile'} | Recruitment.box`} />
            <meta name="twitter:description" content={`Profile of ${ensNameOrAddress || 'Web3 user'} on Recruitment.box`} />
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
        
        <div 
          className={`container px-1 relative z-10 ${isMobile ? '' : 'overflow-hidden'}`}
          style={isMobile ? { paddingTop: '60px' } : { maxWidth: '98vw', height: '100vh', overflow: 'hidden' }}
        >
          {loading ? (
            /* Show detailed loading skeleton */
            <div className="pt-16">
              <ProfileSkeleton />
              
              {/* Additional loading timeout warning */}
              {loadingTimeout && (
                <div className="mt-6 mx-auto max-w-md">
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center gap-3">
                      <div className="text-yellow-600">⚠️</div>
                      <div className="text-yellow-700 font-medium">Loading is taking longer than expected</div>
                    </div>
                    <div className="mt-2 text-sm text-yellow-600">
                      This may be due to network congestion or ENS resolution delays. Please wait...
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Show actual content when loaded */
            <ProfileContent 
              loading={false}
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
