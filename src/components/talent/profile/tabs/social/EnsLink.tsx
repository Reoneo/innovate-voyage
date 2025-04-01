
import React, { memo } from 'react';
import { Globe } from 'lucide-react';

interface EnsLinkProps {
  ensName: string;
}

const EnsLink: React.FC<EnsLinkProps> = ({ ensName }) => {
  if (!ensName) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-5 w-5 text-primary" />
      <a 
        href={`https://app.ens.domains/name/${ensName}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline font-medium"
        data-social-link="ens"
      >
        {ensName}
      </a>
    </div>
  );
};

// Use memo to prevent unnecessary re-renders
export default memo(EnsLink);
