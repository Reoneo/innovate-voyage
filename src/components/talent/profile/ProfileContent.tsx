
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import SimpleLoadingScreen from './SimpleLoadingScreen';
import ProfileNotFound from './ProfileNotFound';
import A4Layout from './components/layout/A4Layout';
import { useDataPreloader } from '@/hooks/useDataPreloader';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  
  // Preload data
  useDataPreloader(passport?.owner_address, ensNameOrAddress);
  
  // Extract GitHub username with simplified logic
  const extractGitHubUsername = () => {
    if (passport?.socials?.github) {
      const githubUrl = passport.socials.github;
      
      if (typeof githubUrl === 'string') {
        if (githubUrl.includes('github.com/')) {
          const parts = githubUrl.split('github.com/');
          return parts[1]?.split(/[/?#]/)[0]?.trim() || null;
        }
        
        if (githubUrl.startsWith('@')) {
          return githubUrl.substring(1).trim() || null;
        }
        
        return githubUrl.trim() || null;
      }
    }
    
    return null;
  };

  const githubUsername = extractGitHubUsername();
  const showGitHubSection = !!githubUsername;

  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-14 flex justify-center">
      {loading ? (
        <SimpleLoadingScreen />
      ) : passport ? (
        <HeaderContainer>
          <A4Layout 
            passport={passport}
            ensNameOrAddress={ensNameOrAddress}
            githubUsername={githubUsername}
            showGitHubSection={showGitHubSection}
          />
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;
