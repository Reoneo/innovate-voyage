
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProfileData } from '@/hooks/useProfileData';
import { usePdfExport } from '@/hooks/usePdfExport';
import { useIsMobile } from '@/hooks/use-mobile';
import { useWalletConnection } from '@/hooks/useWalletConnection';
import { resolveUserIdentifier } from '@/components/talent/profile/utils/AddressResolver';

import ProfileNavigationBar from '@/components/talent/profile/ProfileNavigationBar';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileNotFound from '@/components/talent/profile/ProfileNotFound';
import ProfileActions from '@/components/talent/profile/components/ProfileActions';
import ProfileContainer from '@/components/talent/profile/components/ProfileContainer';

const TalentProfile = () => {
  const { ensName, address: routeAddress, userId, ensNameOrAddress } = useParams<{ 
    ensName: string; 
    address: string; 
    userId: string;
    ensNameOrAddress: string;
  }>();
  
  const [address, setAddress] = useState<string | undefined>(undefined);
  const [ens, setEns] = useState<string | undefined>(undefined);
  const { connectedWallet } = useWalletConnection();
  const isMobile = useIsMobile();
  
  // Resolve address/ENS from URL parameters
  useEffect(() => {
    const { resolvedAddress, resolvedEns } = resolveUserIdentifier({
      ensName,
      address: routeAddress,
      userId,
      ensNameOrAddress
    });
    
    setAddress(resolvedAddress);
    setEns(resolvedEns);
  }, [ensName, routeAddress, userId, ensNameOrAddress]);

  // Fetch profile data
  const { 
    loading, 
    passport, 
    blockchainProfile, 
    transactions, 
    resolvedEns, 
    blockchainExtendedData, 
    avatarUrl, 
    error 
  } = useProfileData(ens, address);
  
  const { profileRef, exportAsPDF } = usePdfExport();

  return (
    <div className={`container mx-auto py-4 md:py-8 ${isMobile ? 'px-2' : 'max-w-5xl'}`}>
      <div className="flex justify-between items-center mb-4">
        <ProfileNavigationBar />
        <ProfileActions connectedWallet={connectedWallet} onExportPDF={exportAsPDF} />
      </div>
      
      {loading ? (
        <ProfileSkeleton />
      ) : passport ? (
        <ProfileContainer 
          passport={passport}
          blockchainProfile={blockchainProfile}
          transactions={transactions}
          resolvedEns={resolvedEns}
          onExportPdf={exportAsPDF}
          blockchainExtendedData={blockchainExtendedData}
          avatarUrl={avatarUrl}
          error={error}
          profileRef={profileRef}
        />
      ) : (
        <ProfileNotFound />
      )}
    </div>
  );
};

export default TalentProfile;
