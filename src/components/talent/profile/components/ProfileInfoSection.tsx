
import React from 'react';
import { Badge } from '@/components/ui/badge';
import SocialLinks from '../tabs/SocialLinks';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Award } from 'lucide-react';

interface ProfileInfoSectionProps {
  passportId: string;
  ownerAddress: string;
  bio?: string;
  socials?: Record<string, string>;
  additionalEnsDomains?: string[];
  poaps?: Array<{
    id: string;
    name: string;
    image_url: string;
    created_date?: string;
    description?: string;
    event?: string;
  }>;
}

const ProfileInfoSection: React.FC<ProfileInfoSectionProps> = ({ 
  passportId, 
  ownerAddress, 
  bio,
  socials = {},
  additionalEnsDomains = [],
  poaps = []
}) => {
  const displayName = passportId.endsWith('.eth') ? passportId : `${ownerAddress.substring(0, 6)}...${ownerAddress.substring(ownerAddress.length - 4)}`;

  // For demo purposes, adding some sample POAPs if none are provided
  const samplePoaps = [
    {
      id: '1',
      name: 'ETHGlobal',
      image_url: 'https://assets.poap.xyz/ethglobal-2023-2023-logo-1680220082663.png',
      created_date: '2023-03-30',
    },
    {
      id: '2',
      name: 'Devcon',
      image_url: 'https://assets.poap.xyz/devcon-vi-2022-logo-1667307267328.png',
      created_date: '2022-10-11'
    },
    {
      id: '3',
      name: 'ETHDenver',
      image_url: 'https://assets.poap.xyz/ethdenver-2023-2023-logo-1677785190303.png',
      created_date: '2023-02-24'
    }
  ];

  const displayPoaps = poaps && poaps.length > 0 ? poaps : samplePoaps;

  return (
    <div className="space-y-4 w-full">
      <div className="mb-4">
        <div className="text-xl font-bold truncate max-w-full">{displayName}</div>
        {bio && <div className="text-sm text-muted-foreground whitespace-pre-wrap">{bio}</div>}
      </div>

      <Tabs defaultValue="social" className="w-full">
        <TabsList>
          <TabsTrigger value="social">Social & Links</TabsTrigger>
        </TabsList>
        <TabsContent value="social">
          <SocialLinks 
            ensName={passportId.endsWith('.eth') ? passportId : undefined} 
            links={[]} 
            socials={socials} 
            additionalEnsDomains={additionalEnsDomains}
            poaps={displayPoaps}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfileInfoSection;
