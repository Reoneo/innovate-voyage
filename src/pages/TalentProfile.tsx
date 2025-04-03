
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useProfileData } from '@/hooks/useProfileData';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import SkillsTab from '@/components/talent/profile/tabs/SkillsTab';
import BlockchainTab from '@/components/talent/profile/tabs/BlockchainTab';
import SocialLinks from '@/components/talent/profile/tabs/SocialLinks';
import ProfileTimeoutError from '@/components/talent/profile/ProfileTimeoutError';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import BlockchainActivity from '@/components/jobs/user-profile/BlockchainActivity';
import VerifiedWorkExperience from '@/components/talent/profile/components/VerifiedWorkExperience';
import { useIsMobile } from '@/hooks/use-mobile';

// Define interface for URL parameters
interface TalentProfileParams {
  ensNameOrAddress: string;
}

const TalentProfile = () => {
  const { ensNameOrAddress } = useParams<keyof TalentProfileParams>() as TalentProfileParams;
  const [activeTab, setActiveTab] = useState('skills');
  const [timeoutError, setTimeoutError] = useState(false);
  const isMobile = useIsMobile();
  
  // Normalize the identity - only accept .eth and .box domains
  const normalizedIdentity = ensNameOrAddress?.toLowerCase();
  
  // Parse the identity to decide whether to use it as ENS name or address
  const isEnsName = normalizedIdentity?.endsWith('.eth') || normalizedIdentity?.endsWith('.box');
  const ensName = isEnsName ? normalizedIdentity : undefined;
  const address = !isEnsName ? normalizedIdentity : undefined;
  
  const { passport, loading, blockchainProfile, transactions, blockchainExtendedData, resolvedEns, avatarUrl } = useProfileData(ensName, address);
  
  // Set a timeout for loading the profile
  useEffect(() => {
    const timeoutTimer = setTimeout(() => {
      if (loading) {
        setTimeoutError(true);
      }
    }, 4000); // 4 seconds timeout
    
    return () => {
      clearTimeout(timeoutTimer);
    };
  }, [loading]);
  
  // Reset timeout error if loading state changes to false
  useEffect(() => {
    if (!loading) {
      setTimeoutError(false);
    }
  }, [loading]);
  
  // If we have a timeout error, show the timeout error component
  if (timeoutError && loading) {
    return <ProfileTimeoutError identity={normalizedIdentity} />;
  }
  
  // Loading state
  if (loading) {
    return <ProfileSkeleton />;
  }
  
  // Not found state
  if (!passport) {
    return <ProfileNotFound ensNameOrAddress={ensNameOrAddress || 'Unknown'} />;
  }

  // Render the appropriate tab content based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'skills':
        return (
          <SkillsTab 
            skills={passport.skills}
            name={passport.name}
            address={passport.owner_address}
            ensName={resolvedEns}
            avatarUrl={avatarUrl || passport.avatar_url}
            additionalEnsDomains={blockchainExtendedData?.boxDomains}
          />
        );
      case 'blockchain':
        return (
          <BlockchainTab 
            address={passport.owner_address}
            ensName={resolvedEns}
            blockchainProfile={blockchainProfile}
            transactions={transactions || []}
          />
        );
      case 'links':
        return (
          <SocialLinks 
            ensName={resolvedEns}
            links={[]}
            socials={passport.socials}
            additionalEnsDomains={blockchainExtendedData?.boxDomains}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen">
      <Helmet>
        <title>
          {passport.name || resolvedEns || passport.owner_address.slice(0, 10)} | Recruitment.box
        </title>
        <meta 
          name="description" 
          content={`View the blockchain CV and skills of ${passport.name || resolvedEns || passport.owner_address.slice(0, 10)} on Recruitment.box.`} 
        />
      </Helmet>

      <div className="flex items-center mb-8">
        <Button variant="ghost" className="mr-2" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-6">
        {/* A4 layout with two columns */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Left column (30%) */}
            <div className="md:w-3/10 p-6 border-r border-gray-200">
              <ProfileHeader
                passport={passport}
                compact={true}
              />
            </div>

            {/* Right column (70%) */}
            <div className="md:w-7/10 p-6">
              <div className="mb-8">
                <h2 className="text-xl font-bold mb-4">Blockchain Experience</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <VerifiedWorkExperience walletAddress={passport.owner_address} />
                  {passport.owner_address && (
                    <BlockchainActivity address={passport.owner_address} />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="my-6">
          <ProfileNavigationBar 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
        </div>

        <div className="mb-12">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
