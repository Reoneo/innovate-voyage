
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
    // Set favicon and other meta tags to user's avatar if available
    if (passport?.avatar_url) {
      // Update favicon
      const link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
      if (link) {
        link.href = passport.avatar_url;
      } else {
        const newLink = document.createElement('link');
        newLink.rel = 'icon';
        newLink.href = passport.avatar_url;
        document.head.appendChild(newLink);
      }
      
      // Set theme color for mobile browser UI
      let metaThemeColor = document.querySelector("meta[name=theme-color]");
      if (!metaThemeColor) {
        metaThemeColor = document.createElement('meta');
        metaThemeColor.setAttribute('name', 'theme-color');
        document.head.appendChild(metaThemeColor);
      }
      metaThemeColor.setAttribute('content', '#6366f1'); // Default theme color
      
      // Get the dominant color from avatar for theme color (this is approximate)
      try {
        const img = new Image();
        img.crossOrigin = "Anonymous";
        img.onload = function() {
          const canvas = document.createElement('canvas');
          canvas.width = 1;
          canvas.height = 1;
          const context = canvas.getContext('2d');
          context?.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = context?.getImageData(0, 0, 1, 1).data || [99, 102, 241, 255];
          const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          if (metaThemeColor) {
            metaThemeColor.setAttribute('content', color);
          }
        };
        img.src = passport.avatar_url;
      } catch (e) {
        console.error('Error getting avatar color:', e);
      }
    }

    // Clean URL - remove timestamp query parameter and fix duplicate paths
    if (window.history && window.location.href) {
      let cleanUrl = window.location.pathname;
      
      // Fix duplicate recruitment.box in URL
      if (cleanUrl.includes('recruitment.box/recruitment.box/')) {
        cleanUrl = cleanUrl.replace('recruitment.box/recruitment.box/', 'recruitment.box/');
      }
      
      // Remove trailing slash if present
      if (cleanUrl !== '/' && cleanUrl.endsWith('/')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      
      // Apply clean URL if different from current
      if (window.location.pathname !== cleanUrl || window.location.search) {
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
            <link rel="apple-touch-icon" href={passport.avatar_url} />
            <meta name="apple-mobile-web-app-title" content={ensNameOrAddress || 'Profile'} />
            <meta name="application-name" content={ensNameOrAddress || 'Profile'} />
            <meta property="og:image" content={passport.avatar_url} />
            <meta name="mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-capable" content="yes" />
            <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
            <link rel="manifest" href={`data:application/manifest+json,${JSON.stringify({
              name: ensNameOrAddress || 'Profile',
              short_name: ensNameOrAddress || 'Profile',
              icons: [{ src: passport.avatar_url, sizes: "192x192", type: "image/png" }],
              theme_color: "#6366f1",
              background_color: "#ffffff",
              display: "standalone"
            })}`} />
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
