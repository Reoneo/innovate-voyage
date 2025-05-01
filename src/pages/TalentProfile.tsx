
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
    // Set favicon and iOS/Android home screen icons to user's avatar if available
    if (passport?.avatar_url) {
      // Set favicon
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = passport.avatar_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = passport.avatar_url;
        document.head.appendChild(newLink);
      }
      
      // Set safari-specific theme color based on user's avatar
      const metaThemeColor = document.querySelector("meta[name='theme-color']");
      if (metaThemeColor) {
        metaThemeColor.setAttribute('content', '#ffffff');
      } else {
        const newMetaTheme = document.createElement('meta');
        newMetaTheme.name = 'theme-color';
        newMetaTheme.content = '#ffffff';
        document.head.appendChild(newMetaTheme);
      }
    }

    // Clean URL - remove timestamp query parameter and trailing slashes
    if (window.history) {
      const currentPath = window.location.pathname;
      let cleanUrl = currentPath;
      
      // Remove trailing slash
      if (cleanUrl.length > 1 && cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      
      // Fix duplicate paths
      if (cleanUrl.includes('recruitment.box/recruitment.box/')) {
        cleanUrl = cleanUrl.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
      }
      
      // Apply cleaned URL if it's different from current path
      if (cleanUrl !== currentPath || window.location.search) {
        window.history.replaceState({}, document.title, cleanUrl);
      }
    }
  }, [passport?.avatar_url]);

  return (
    <>
      <Helmet>
        <title>{ensNameOrAddress || 'Profile'}</title>
        {passport?.avatar_url && (
          <>
            {/* iOS Safari specific meta tags for home screen */}
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="default" />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta name="theme-color" content="#ffffff" />
            
            {/* Open Graph for better sharing and previews */}
            <meta property="og:image" content={passport.avatar_url} />
            <meta property="og:title" content={ensNameOrAddress || 'Profile'} />
            <meta property="og:site_name" content="Recruitment Box" />
            
            {/* Twitter Card for Twitter previews */}
            <meta name="twitter:card" content="summary" />
            <meta name="twitter:image" content={passport.avatar_url} />
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
