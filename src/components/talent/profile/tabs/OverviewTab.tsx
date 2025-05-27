import React from 'react';
import { BlockchainProfile } from '@/api/types/etherscanTypes';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string }>;
  name: string;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  address: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
  avatarUrl?: string;
  ensName?: string;
  additionalEnsDomains?: string[];
}

const OverviewTab: React.FC<OverviewTabProps> = () => {
  // This component is no longer used but I'm keeping it as an empty component
  // in case there are other references to it in the codebase
  return null;
};

export default OverviewTab;
