
import React from 'react';
import { Network } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';

interface IdentityNetworkSectionProps {
  name: string;
  avatarUrl?: string;
  ensName?: string;
  address: string;
  additionalEnsDomains?: string[];
}

const IdentityNetworkSection: React.FC<IdentityNetworkSectionProps> = ({
  name,
  avatarUrl,
  ensName,
  address,
  additionalEnsDomains = []
}) => {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl flex items-center gap-2">
          <Network className="h-5 w-5" />
          Identity Network
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <IdNetworkGraph 
            name={name} 
            avatarUrl={avatarUrl}
            ensName={ensName}
            address={address}
            additionalEnsDomains={additionalEnsDomains}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default IdentityNetworkSection;
