
import React from 'react';
import AddressDisplay from './AddressDisplay';
import { useEfpStats } from '@/hooks/useEfpStats';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/)
    ? `${name}.eth`
    : name);
  
  const { followers, following, loading } = useEfpStats(ownerAddress);

  return (
    <div className="mt-2 text-center">
      <h3 className="text-2xl font-semibold">{displayName}</h3>
      <div className="flex items-center justify-center gap-2 mt-1">
        <AddressDisplay address={ownerAddress} />
      </div>
      {/* EFP stats */}
      <div className="mt-1 flex items-center justify-center text-[#9b87f5] font-semibold space-x-1 text-sm">
        {loading ? (
          <span>Loading...</span>
        ) : (
          <>
            <span>{followers} Followers</span>
            <span className="opacity-70">&nbsp;&nbsp;•&nbsp;&nbsp;</span>
            <span>Following {following}</span>
          </>
        )}
      </div>
    </div>
  );
};

export default NameSection;
