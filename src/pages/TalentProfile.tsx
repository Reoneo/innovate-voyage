
import React, { useEffect, useState } from 'react';
import { useProfilePage } from '@/hooks/useProfilePage';
import ProfileNavbar from '@/components/talent/profile/ProfileNavbar';
import ProfileContent from '@/components/talent/profile/ProfileContent';
import { Helmet } from 'react-helmet-async';
import AnimatedBackground from '@/components/ui/animated-background';

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
  
  const [dominantColor, setDominantColor] = useState<string | null>(null);

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
      
      // Extract dominant color from avatar
      const img = new Image();
      img.crossOrigin = "Anonymous";
      img.src = passport.avatar_url;
      
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 1;
        canvas.height = 1;
        const ctx = canvas.getContext('2d');
        
        if (ctx) {
          ctx.drawImage(img, 0, 0, 1, 1);
          const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
          const color = `rgb(${r}, ${g}, ${b})`;
          setDominantColor(color);
        }
      };
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
      <div className="min-h-screen">
        {/* Animated Background */}
        <AnimatedBackground dominantColor={dominantColor} />
        
        {/* Navigation Bar */}
        <ProfileNavbar 
          connectedWallet={connectedWallet}
          onDisconnect={handleDisconnect}
          onSaveChanges={handleSaveChanges}
        />
        
        <div className="container relative z-10">
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
