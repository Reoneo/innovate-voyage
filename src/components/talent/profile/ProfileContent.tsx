
import React from 'react';
import { Copy, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { BlockchainPassport } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import IdNetworkGraph from '@/components/visualizations/identity/IdNetworkGraph';
import SkillsList from './components/SkillsList';
import SocialLinks from './components/SocialLinks';
import WorkExperienceSection from './components/WorkExperienceSection';

interface ProfileContentProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
  };
  blockchainProfile?: BlockchainProfile;
  transactions?: any[] | null;
  resolvedEns?: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
  avatarUrl?: string;
  isOwner: boolean;
  onCopyAddress: () => void;
}

const ProfileContent: React.FC<ProfileContentProps> = ({
  passport,
  blockchainProfile,
  transactions,
  resolvedEns,
  blockchainExtendedData,
  avatarUrl,
  isOwner,
  onCopyAddress
}) => {
  // Format address for display
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column */}
      <div className="space-y-8">
        {/* Profile Overview */}
        <div className="flex flex-col items-center md:items-start">
          <div className="relative">
            <Avatar className="h-36 w-36 rounded-full border-4 border-[#9b87f5] bg-[#9b87f5]/30">
              <AvatarImage src={avatarUrl || passport.avatar_url || '/placeholder.svg'} alt={passport.name} />
              <AvatarFallback className="text-3xl">{passport.name?.substring(0, 2)?.toUpperCase() || 'BP'}</AvatarFallback>
            </Avatar>
          </div>
          
          <h1 className="text-3xl font-bold mt-4">{passport.name || resolvedEns || "Anonymous"}</h1>
          
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-lg">{resolvedEns}</p>
          </div>
          
          <div className="flex items-center space-x-2 mt-1 text-gray-400">
            <p>{formatAddress(passport.owner_address)}</p>
            <Button variant="ghost" size="icon" onClick={onCopyAddress} className="h-6 w-6">
              <Copy className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Bio</h2>
          <p className="text-gray-300">
            {passport.bio || blockchainProfile?.description || blockchainExtendedData?.description || "No bio available."}
          </p>
        </div>

        {/* Contact */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Contact Me</h2>
          <div className="space-y-1">
            {passport.socials?.email ? (
              <p>Email: {passport.socials.email}</p>
            ) : (
              <p>Email: Fetch Email ens address</p>
            )}
            <p>Tel: Fetch Whatsapp ens number</p>
          </div>
        </div>

        {/* Links */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Links</h2>
          <SocialLinks 
            ensName={resolvedEns} 
            links={blockchainExtendedData?.boxDomains || []}
            socials={passport.socials || {}}
          />
        </div>

        {/* Skills */}
        <SkillsList 
          skills={passport.skills || []}
          isOwner={isOwner}
          ownerAddress={passport.owner_address}
        />
        
        {/* Resume/CV Link */}
        <div className="space-y-2">
          <h2 className="text-xl font-semibold">Resume / CV Link</h2>
          <Button variant="outline" className="flex gap-2 w-full">
            <FileText size={18} />
            Download Resume
          </Button>
        </div>
      </div>

      {/* Right Column */}
      <div className="space-y-8">
        {/* ID Network */}
        <div className="border rounded-lg bg-[#222632] overflow-hidden">
          <div className="p-4 pb-0">
            <h2 className="text-lg font-medium flex items-center gap-2">
              <span className="text-[#9b87f5]">◆</span> ID Network
              <span className="text-xs text-gray-400 ml-2">ENS Domains & Identity connections</span>
            </h2>
          </div>
          <div className="h-[280px] w-full">
            <IdNetworkGraph 
              name={passport.name || resolvedEns || "Anonymous"} 
              avatarUrl={avatarUrl}
              ensName={resolvedEns}
              address={passport.owner_address}
            />
          </div>
          <div className="p-4 pt-0">
            <div className="text-xs text-gray-400">
              <p>Legend:</p>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                  <span>Main Identity</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-violet-500"></div>
                  <span>ENS Domain</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-indigo-400"></div>
                  <span>Box Domain</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                  <span>Other ID Protocol</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Proof of Attendance Protocol */}
        <div className="border rounded-lg bg-[#222632] p-4">
          <h2 className="text-lg font-medium mb-3">Proof of Attendance Protocol (POAP)</h2>
          <div className="text-gray-400">
            {blockchainExtendedData ? (
              <p>No POAPs available for this address</p>
            ) : (
              <p>No POAPs available for this address</p>
            )}
          </div>
        </div>
        
        {/* Work Experience */}
        <WorkExperienceSection 
          ownerAddress={passport.owner_address}
        />
      </div>
    </div>
  );
};

export default ProfileContent;
