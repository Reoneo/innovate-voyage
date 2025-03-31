import React from 'react';
import { Users } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import TalentProfileCard from './TalentProfileCard';
import { BlockchainPassport } from '@/lib/utils';

interface TalentGridProps {
  isLoading: boolean;
  passportData: Array<BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
    hasMoreSkills: boolean;
  }>;
  clearFilters: () => void;
}

// Featured profiles to display when no search results are found
const FEATURED_PROFILES = [
  {
    passport_id: '30315.eth',
    owner_address: '0x1234567890123456789012345678901234567890', // Placeholder address
    avatar_url: '/placeholder.svg',
    name: '30315',
    issued: new Date().toISOString(),
    skills: [
      { name: 'ETH Holder', proof: 'etherscan://0x1234567890123456789012345678901234567890' },
      { name: 'ENS Owner', proof: 'ens://30315.eth' }
    ],
    socials: {
      github: 'https://github.com/30315',
      twitter: 'https://twitter.com/30315',
      linkedin: 'https://linkedin.com/in/30315',
      website: 'https://30315.eth.xyz'
    },
    score: 75,
    category: 'Verified',
    colorClass: 'bg-green-500',
    hasMoreSkills: false
  },
  {
    passport_id: 'vitalik.eth',
    owner_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    avatar_url: '/placeholder.svg',
    name: 'vitalik',
    issued: new Date().toISOString(),
    skills: [
      { name: 'ETH Holder', proof: 'etherscan://0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045' },
      { name: 'ENS Owner', proof: 'ens://vitalik.eth' }
    ],
    socials: {
      github: 'https://github.com/vbuterin',
      twitter: 'https://twitter.com/VitalikButerin',
      website: 'https://vitalik.ca'
    },
    score: 95,
    category: 'Verified',
    colorClass: 'bg-green-500',
    hasMoreSkills: true
  },
  {
    passport_id: 'nick.eth',
    owner_address: '0x5b2A5d1f4510b893A2348B01F5166B737ABe6be1',
    avatar_url: '/placeholder.svg',
    name: 'nick',
    issued: new Date().toISOString(),
    skills: [
      { name: 'ETH Holder', proof: 'etherscan://0x5b2A5d1f4510b893A2348B01F5166B737ABe6be1' },
      { name: 'ENS Owner', proof: 'ens://nick.eth' }
    ],
    socials: {
      twitter: 'https://twitter.com/nicksdjohnson',
      github: 'https://github.com/arachnid'
    },
    score: 85,
    category: 'Verified',
    colorClass: 'bg-green-500',
    hasMoreSkills: false
  }
];

const TalentGrid: React.FC<TalentGridProps> = ({ isLoading, passportData }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="overflow-hidden border border-muted/60">
            <div className="p-4 pb-2">
              <div className="flex items-center gap-4">
                <Skeleton className="h-16 w-16 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-32" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </div>
            </div>
            <div className="p-4">
              <div className="space-y-3">
                <Skeleton className="h-4 w-full" />
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-16 rounded-full" />
                  ))}
                </div>
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (passportData.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-2xl font-bold">Featured Profiles</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURED_PROFILES.map((profile) => (
            <TalentProfileCard 
              key={profile.passport_id} 
              passport={profile} 
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {passportData.map((passport) => (
        <TalentProfileCard 
          key={passport.owner_address} 
          passport={passport} 
        />
      ))}
    </div>
  );
};

export default TalentGrid;
