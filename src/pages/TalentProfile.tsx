
import React, { useEffect } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
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
            {/* iOS Home Screen Icon Support */}
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            
            {/* Android Home Screen Icon Support */}
            <link rel="manifest" href={`data:application/manifest+json,{"name":"${ensNameOrAddress || 'Profile'}","icons":[{"src":"${passport.avatar_url}","sizes":"192x192","type":"image/png"}],"start_url":"${window.location.pathname}","display":"standalone"}`} />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta name="theme-color" content="#ffffff" />
            
            {/* General Meta Tags for Social Sharing & Browser Tab */}
            <meta property="og:image" content={passport.avatar_url} />
            <meta property="og:title" content={ensNameOrAddress || 'Profile'} />
            <meta property="twitter:image" content={passport.avatar_url} />
            <meta name="twitter:card" content="summary" />
          </>
        )}
      </Helmet>
      <div className="min-h-screen bg-gray-50">
        {/* Navigation Bar */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
        />
        
        <div className="container mx-auto px-4 pt-4" style={{ maxWidth: '950px' }}>
          {/* Profile Content */}
          <ProfileContent 
            loading={loading}
            loadingTimeout={loadingTimeout}
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
