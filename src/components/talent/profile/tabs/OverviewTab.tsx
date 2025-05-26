
import React from 'react';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string }>;
  name: string;
  blockchainProfile?: any;
  transactions?: any[] | null;
  address: string;
  blockchainExtendedData?: any;
  avatarUrl?: string;
  ensName?: string;
  additionalEnsDomains?: string[];
}

const OverviewTab: React.FC<OverviewTabProps> = () => {
  // Component simplified for speed optimization
  return null;
};

export default OverviewTab;
