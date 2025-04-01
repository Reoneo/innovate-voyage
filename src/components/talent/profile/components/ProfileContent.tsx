
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import HeaderContainer from '@/components/talent/profile/components/HeaderContainer';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import AvatarSection from '@/components/talent/profile/components/AvatarSection';
import VerifiedWorkExperience from '@/components/talent/profile/components/VerifiedWorkExperience';

interface ProfileContentProps {
  loading: boolean;
  passport: any | null;
  displayIdentity: string;
  profileRef: React.RefObject<HTMLDivElement>;
}

const ProfileContent: React.FC<ProfileContentProps> = ({ 
  loading, 
  passport, 
  displayIdentity,
  profileRef 
}) => {
  if (loading) {
    return <ProfileSkeleton />;
  }

  if (!passport) {
    return (
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't find a profile for {displayIdentity}
          </p>
          <Link to="/">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Return to Home
            </Button>
          </Link>
        </div>
      </HeaderContainer>
    );
  }

  return (
    <HeaderContainer>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left column with avatar and social links */}
        <div className="md:col-span-1">
          <AvatarSection 
            avatarUrl={passport.avatar_url}
            name={passport.name}
            ownerAddress={passport.owner_address}
            socials={passport.socials}
            bio={passport.bio}
            displayIdentity={displayIdentity}
            additionalEnsDomains={passport.additionalEnsDomains}
          />
        </div>
        
        {/* Right column with work experience */}
        <div className="md:col-span-2">
          <VerifiedWorkExperience 
            walletAddress={passport.owner_address} 
          />
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileContent;
