
import React from 'react';
import AddressDisplay from './AddressDisplay';

interface NameSectionProps {
  name: string;
  ownerAddress: string;
  displayIdentity?: string;
}

const NameSection: React.FC<NameSectionProps> = ({ name, ownerAddress, displayIdentity }) => {
  // Determine display name - prefer displayIdentity (URL slug) over name
  const displayName = displayIdentity || (name && !name.includes('.') && name.match(/^[a-zA-Z0-9]+$/) 
    ? `${name}.eth` 
    : name);
    
  return (
    <div className="mt-2 text-center md:text-left">
      <h3 className="text-2xl font-semibold">{displayName}</h3>
      <div className="flex items-center gap-2 mt-1">
        <AddressDisplay address={ownerAddress} />
      </div>
    </div>
  );
};

export default NameSection;
