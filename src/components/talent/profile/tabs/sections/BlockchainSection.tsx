
import React from 'react';
import BlockchainTab from '../../tabs/BlockchainTab';

interface BlockchainSectionProps {
  transactions?: any[] | null;
  address: string;
  error?: Error | null;
}

const BlockchainSection: React.FC<BlockchainSectionProps> = ({
  transactions,
  address,
  error
}) => {
  return (
    <BlockchainTab 
      transactions={transactions}
      address={address}
      error={error}
    />
  );
};

export default BlockchainSection;
