
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
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

const TalentProfile = () => {
  const { ensNameOrAddress } = useParams<{ensNameOrAddress: string}>();
  const [activeTab, setActiveTab] = useState('skills');
  const [timeoutError, setTimeoutError] = useState(false);
  
  // Normalize the identity
  const normalizedIdentity = ensNameOrAddress?.toLowerCase().endsWith('.eth') ||
    ensNameOrAddress?.toLowerCase().endsWith('.box')
    ? ensNameOrAddress.toLowerCase()
    : ensNameOrAddress;
  
  // Parse the identity to decide whether to use it as ENS name or address
  const isEnsName = normalizedIdentity?.includes('.'); // Check if it contains a dot (e.g., .eth, .lens, etc.)
  const ensName = isEnsName ? normalizedIdentity : undefined;
  const address = !isEnsName ? normalizedIdentity : undefined;
  
  const { passport, loading } = useProfileData(ensName, address);
  
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
            blockchainProfile={passport.blockchainProfile}
            transactions={passport.transactions}
            address={passport.address}
            blockchainExtendedData={passport.blockchainExtendedData}
            avatarUrl={passport.avatarUrl}
            ensName={passport.ensName}
            additionalEnsDomains={passport.blockchainExtendedData?.boxDomains}
          />
        );
      case 'blockchain':
        return (
          <BlockchainTab 
            transactions={passport.transactions}
            blockchainProfile={passport.blockchainProfile}
            address={passport.address}
            ensName={passport.ensName}
          />
        );
      case 'links':
        return (
          <SocialLinks 
            ensName={passport.ensName}
            links={passport.profile.links || []}
            socials={passport.profile.socials || {}}
            additionalEnsDomains={passport.blockchainExtendedData?.boxDomains}
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
          {passport.name || passport.ensName || passport.address.slice(0, 10)} | Recruitment.box
        </title>
        <meta 
          name="description" 
          content={`View the blockchain CV and skills of ${passport.name || passport.ensName || passport.address.slice(0, 10)} on Recruitment.box.`} 
        />
      </Helmet>

      <ProfileHeader
        passport={passport}
        loading={loading}
      />
      
      <div className="my-6">
        <ProfileNavigationBar 
          activeTab={activeTab} 
          setActiveTab={setActiveTab} 
        />
      </div>

      <div className="mb-12">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default TalentProfile;
