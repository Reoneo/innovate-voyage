import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import ProfileSkeleton from './ProfileSkeleton';
import ProfileNotFound from './ProfileNotFound';
import AvatarSection from './components/AvatarSection';
import TalentScoreBanner from './components/TalentScoreBanner';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';
import { useIsMobile } from '@/hooks/use-mobile';
import LinkedInExperienceSection from './components/LinkedInExperienceSection';
import { useLinkedInExperience } from '@/api/services/linkedinService';
import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileContentProps {
  loading: boolean;
  loadingTimeout: boolean;
  passport: any;
  profileRef: React.RefObject<HTMLDivElement>;
  ensNameOrAddress?: string;
  error?: string | null;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  loading,
  loadingTimeout,
  passport,
  profileRef,
  ensNameOrAddress,
  error
}) => {
  const isMobile = useIsMobile();
  
  // Handle error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-4 md:py-8">
        <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
          <HeaderContainer>
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
              <p className="text-muted-foreground mb-6">
                {error}
              </p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          </HeaderContainer>
        </div>
      </div>
    );
  }
  
  // Handle timeout error
  if (loadingTimeout && loading) {
    return <ProfileTimeoutError ensNameOrAddress={ensNameOrAddress} />;
  }
  
  // Check if we have talent protocol data - look for score to determine this
  const hasTalentProtocolData = passport?.score !== undefined && passport?.score !== null;
  
  // Extract GitHub username from social links with improved handling
  const extractGitHubUsername = () => {
    // First check if we already have github username directly in socials
    if (passport?.socials?.github) {
      const directGithub = passport.socials.github;
      
      // If it's already a clean username (no URL), return it
      if (typeof directGithub === 'string' && !directGithub.includes('/') && !directGithub.includes('.')) {
        if (directGithub.startsWith('@')) {
          return directGithub.substring(1); // Remove @ prefix
        }
        return directGithub;
      }
      
      // Try to extract from URL if it's not a clean username
      if (typeof directGithub === 'string') {
        // Handle github.com URL format
        if (directGithub.includes('github.com/')) {
          const parts = directGithub.split('github.com/');
          // Get everything after github.com/ and before any query params or hashes
          const username = parts[1]?.split(/[/?#]/)[0];
          return username?.trim() || null;
        }
        
        // Handle direct username format with @ prefix
        if (directGithub.startsWith('@')) {
          return directGithub.substring(1).trim(); // Remove @ prefix
        }
        
        // Handle pure username format (no URL, no @)
        if (directGithub.trim() !== '') {
          return directGithub.trim();
        }
      }
    }
    
    return null;
  };

  // Get GitHub username from ENS records
  const githubUsername = extractGitHubUsername();
  
  // Only show GitHub section if there's a GitHub username AND we have talent protocol data
  const showGitHubSection = !!githubUsername && hasTalentProtocolData;
  
  // Fetch LinkedIn work experience if we have talent protocol data
  const { experience, isLoading: isLoadingExperience, error: experienceError } = 
    useLinkedInExperience(hasTalentProtocolData ? passport?.socials : null);

  // Only show LinkedIn section if we have Talent Protocol data
  const showLinkedInSection = hasTalentProtocolData && 
    passport?.socials?.linkedin && 
    typeof passport?.socials?.linkedin === 'string';

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
              />
            </div>
            <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
              <TalentScoreBanner walletAddress={passport.owner_address} />
              
              {/* GitHub contribution graph - only if talent protocol data exists */}
              {showGitHubSection && (
                <div className="mt-4">
                  <GitHubContributionGraph username={githubUsername!} />
                </div>
              )}
              
              {/* LinkedIn work experience section - only if talent protocol data exists */}
              {showLinkedInSection && (
                <div className="mt-4">
                  <LinkedInExperienceSection 
                    experience={experience} 
                    isLoading={isLoadingExperience} 
                    error={experienceError} 
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

const ProfileTimeoutError: React.FC<{ ensNameOrAddress?: string }> = ({ ensNameOrAddress }) => (
  <div className="min-h-screen bg-gray-50 py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertTriangle className="h-12 w-12 text-amber-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. The request timed out.
          </p>
          <Button onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </HeaderContainer>
    </div>
  </div>
);
