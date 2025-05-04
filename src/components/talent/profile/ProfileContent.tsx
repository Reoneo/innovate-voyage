
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';
import { useIsMobile } from '@/hooks/use-mobile';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

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
  
  // Only show timeout error if we're still loading and the timeout has occurred
  if (loadingTimeout && loading) {
    return <ProfileTimeoutState ensNameOrAddress={ensNameOrAddress} />;
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

  // Get GitHub username from ENS records
  const githubUsername = extractGitHubUsername();
  
  // Debug logging
  console.log('GitHub data from passport:', {
    username: githubUsername,
    originalValue: passport?.socials?.github,
    passport: passport ? 'exists' : 'null'
  });
  
  // Only show GitHub section if there's a GitHub username
  const showGitHubSection = !!githubUsername;
  
  // Check if avatar is a mock/placeholder
  const isMockAvatar = !passport?.avatar_url || 
    passport.avatar_url.includes('placeholder') || 
    passport.avatar_url.includes('avatar-placeholder');
  
  return (
    <div ref={profileRef} id="resume-pdf" className="w-full pt-16">
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
                isMockAvatar={isMockAvatar}
              />
            </div>
            <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
              <TalentScoreBanner walletAddress={passport.owner_address} />
              
              {/* GitHub contribution graph moved to column 2 */}
              {showGitHubSection && (
                <div className="mt-4">
                  <GitHubContributionGraph 
                    username={githubUsername!} 
                    walletAddress={passport.owner_address}
                  />
                </div>
              )}
            </div>
          </div>
        </HeaderContainer>
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default ProfileContent;

// Updated timeout component with refresh button
const ProfileTimeoutState: React.FC<{ ensNameOrAddress?: string }> = ({ ensNameOrAddress }) => {
  // Handler to refresh the page
  const handleRefresh = () => {
    // Adding a timestamp parameter to force fresh load
    const timestamp = new Date().getTime();
    window.location.href = `${window.location.pathname}?t=${timestamp}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 py-4 md:py-8">
      <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
        <HeaderContainer>
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <h2 className="text-2xl font-bold mb-2">Loading Profile</h2>
            <p className="text-muted-foreground mb-6">
              Please wait while we load data for {ensNameOrAddress}.<br />
              This may take longer for profiles with many ENS domains.
            </p>
            <div className="flex items-center justify-center gap-2">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span className="text-sm text-muted-foreground">Still working...</span>
            </div>
            <div className="mt-6">
              <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh Page
              </Button>
            </div>
          </div>
        </HeaderContainer>
      </div>
    </div>
  );
};
