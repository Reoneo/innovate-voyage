
import React from 'react';
import { Globe } from 'lucide-react';

interface EnsLinkProps {
  ensName: string;
}

const EnsLink: React.FC<EnsLinkProps> = ({ ensName }) => {
  if (!ensName) return null;
  
  return (
    <div className="flex items-center gap-2">
      <Globe className="h-4 w-4" />
      <a 
        href={`https://app.ens.domains/name/${ensName}`}
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
        data-social-link="ens"
      >
        {ensName}
      </a>
    </div>
  );
};

export default EnsLink;
