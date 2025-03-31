
import React from 'react';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';
import ProfileTabs from './tabs/ProfileTabs';

interface ProfileTabsContainerProps {
  passport: BlockchainPassport & {
    category: string;
  };
  blockchainProfile?: BlockchainProfile;
  transactions?: any[] | null;
  resolvedEns?: string;
  onExportPdf: () => void;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
    description?: string;
  };
  avatarUrl?: string;
  ownerAddress: string;
  additionalEnsDomains?: string[];
  blockchainError?: Error | null;
}

const ProfileTabsContainer: React.FC<ProfileTabsContainerProps> = (props) => {
  return (
    <ProfileTabs
      passport={props.passport}
      blockchainProfile={props.blockchainProfile}
      transactions={props.transactions}
      resolvedEns={props.resolvedEns}
      blockchainExtendedData={props.blockchainExtendedData}
      avatarUrl={props.avatarUrl}
      ownerAddress={props.ownerAddress}
      additionalEnsDomains={props.additionalEnsDomains}
      blockchainError={props.blockchainError}
    />
  );
};

export default ProfileTabsContainer;
