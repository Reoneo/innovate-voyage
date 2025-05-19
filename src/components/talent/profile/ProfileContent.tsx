
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';
import FarcasterCasts from './components/farcaster/FarcasterCasts';
import FuturisticGitHubFooter from './components/github/FuturisticGitHubFooter';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  loadingTimeout,
  passport,
  profileRef,
  ensNameOrAddress
}) => {
  const isMobile = useIsMobile();
  
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }
  
  // Extract GitHub username from social links with improved handling
  const extractGitHubUsername = () => {
    // First check if we already have github username directly in socials
    if (passport?.socials?.github) {
      const directGithub = passport.socials.github;
      console.log('GitHub from passport.socials.github:', directGithub);
      
      // If it's already a clean username (no URL), return it
      if (typeof directGithub === 'string' && !directGithub.includes('/') && !directGithub.includes('.')) {
        if (directGithub.startsWith('@')) {
          return directGithub.substring(1); // Remove @ prefix
        }
        return directGithub;
      }
    }
    
    // If nothing found or we need to extract from URL
    if (!passport?.socials?.github) {
      console.log('No GitHub social link found in passport');
      return null;
    }
    
    const githubUrl = passport.socials.github;
    console.log('Extracting GitHub username from:', githubUrl);
    
    try {
      // Handle different GitHub URL formats
      if (typeof githubUrl === 'string') {
        // Handle github.com URL format
        if (githubUrl.includes('github.com/')) {
          const parts = githubUrl.split('github.com/');
          // Get everything after github.com/ and before any query params or hashes
          const username = parts[1]?.split(/[/?#]/)[0];
          console.log('Extracted GitHub username from URL:', username);
          return username?.trim() || null;
        }
        
        // Handle direct username format with @ prefix
        if (githubUrl.startsWith('@')) {
          const username = githubUrl.substring(1).trim(); // Remove @ prefix
          console.log('Extracted GitHub username from @-prefix:', username);
          return username || null;
        }
        
        // Handle pure username format (no URL, no @)
        if (githubUrl.trim() !== '') {
          const username = githubUrl.trim();
          console.log('Using GitHub value directly as username:', username);
          return username;
        }
      }
    } catch (error) {
      console.error('Error extracting GitHub username:', error);
    }
    
    console.log('Could not extract GitHub username');
    return null;
  };

  // Extract ENS domain for Farcaster handle
  const getFarcasterHandle = () => {
    // If we have an ENS name, use it as the handle
    if (passport?.resolved_ens && passport.resolved_ens.includes('.eth')) {
      return passport.resolved_ens.split('.eth')[0]; // Remove .eth suffix for Farcaster handle
    }
    
    // If ensNameOrAddress is an ENS name, use it
    if (ensNameOrAddress && ensNameOrAddress.includes('.eth')) {
      return ensNameOrAddress.split('.eth')[0];
    }
    
    return null;
  };

  // Get GitHub username from ENS records
  const githubUsername = extractGitHubUsername();
  const farcasterHandle = getFarcasterHandle();
  
  // Debug logging
  console.log('GitHub data from passport:', {
    username: githubUsername,
    originalValue: passport?.socials?.github,
    passport: passport ? 'exists' : 'null'
  });
  console.log('Farcaster handle:', farcasterHandle);
  
  // Only show GitHub section if there's a GitHub username
  const showGitHubSection = !!githubUsername;
  const showFarcasterSection = !!farcasterHandle;

  return (
    <>
      <div ref={profileRef} id="resume-pdf" className="w-full pt-16 pb-24">
        {loading && !loadingTimeout ? (
          <ProfileSkeleton />
        ) : passport ? (
          <HeaderContainer>
            <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-6 h-full">
              <div className={`${isMobile ? 'w-full' : 'md:col-span-3'} flex flex-col space-y-4`}>
                <AvatarSection
                  avatarUrl={passport.avatar_url}
                  name={passport.name}
                  ownerAddress={passport.owner_address}
                  socials={{
                    ...passport.socials,
                    linkedin: passport.socials.linkedin ? passport.socials.linkedin : undefined
                  }}
                  bio={passport.bio}
                  displayIdentity={ensNameOrAddress}
                  additionalEnsDomains={passport.additionalEnsDomains}
                />
              </div>
              <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
                <TalentScoreBanner walletAddress={passport.owner_address} />
                
                {/* Farcaster section */}
                {showFarcasterSection && (
                  <div className="mt-4">
                    <FarcasterCasts handle={farcasterHandle} />
                  </div>
                )}
              </div>
            </div>
          </HeaderContainer>
        ) : (
          <ProfileNotFound />
        )}
      </div>
      
      {/* GitHub footer - only show if there's a GitHub username */}
      {passport && showGitHubSection && (
        <FuturisticGitHubFooter username={githubUsername} />
      )}
    </>
  );
};

export default ProfileContent;

const ProfileTimeoutError: React.FC<{ ensNameOrAddress?: string }> = ({ ensNameOrAddress }) => (
  <div className="min-h-screen bg-gray-50 py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. The request timed out.
          </p>
        </div>
      </HeaderContainer>
    </div>
  </div>
);
