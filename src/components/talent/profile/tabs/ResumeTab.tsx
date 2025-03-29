
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Briefcase, ChevronRight, Award, Activity, Box } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { SocialIcon } from '@/components/ui/social-icon';

interface ResumeTabProps {
  passport: {
    passport_id: string;
    owner_address: string;
    skills: Array<{ name: string; proof?: string }>;
    score: number;
    category: string;
    socials?: {
      email?: string;
      github?: string;
      twitter?: string;
      linkedin?: string;
      website?: string;
    };
  };
  blockchainProfile?: BlockchainProfile | null;
  resolvedEns?: string;
  onExportPdf: () => void;
}

const ResumeTab: React.FC<ResumeTabProps> = ({ 
  passport, 
  blockchainProfile, 
  resolvedEns,
  onExportPdf 
}) => {
  // Calculate first transaction date if available
  const firstTransactionDate = blockchainProfile?.latestTransactions?.length 
    ? new Date(Math.min(...blockchainProfile.latestTransactions.map(tx => parseInt(tx.timeStamp) * 1000))).getFullYear()
    : 'recent years';

  // Filter verified skills (from TalentProtocol.com)
  const verifiedSkills = passport.skills.filter(skill => skill.proof && skill.proof.includes('talentprotocol.com'));
  
  // Get featured .box usernames
  const boxUsernames = ['vitalik.box', 'ethereum.box', 'web3.box']; // This would be replaced with actual API data

  return (
    <>
      <Card id="resume-pdf" className="bg-white print:shadow-none">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Blockchain Resume
            </CardTitle>
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
              {passport.score} • {passport.category}
            </div>
          </div>
          <CardDescription className="text-base">
            Web3 Professional Profile
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-8">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between gap-4 border-b pb-4">
              <div>
                <h1 className="text-2xl font-bold">{resolvedEns || truncateAddress(passport.owner_address)}</h1>
                <p className="text-muted-foreground mt-1">{truncateAddress(passport.owner_address)}</p>
              </div>
              
              {/* Social Media Icons */}
              <div className="flex gap-3">
                {passport.socials?.github && (
                  <a href={passport.socials.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <SocialIcon type="github" size={24} />
                  </a>
                )}
                {passport.socials?.twitter && (
                  <a href={passport.socials.twitter} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <SocialIcon type="twitter" size={24} />
                  </a>
                )}
                {passport.socials?.linkedin && (
                  <a href={passport.socials.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <SocialIcon type="linkedin" size={24} />
                  </a>
                )}
                {passport.socials?.website && (
                  <a href={passport.socials.website} target="_blank" rel="noopener noreferrer" aria-label="Website">
                    <SocialIcon type="globe" size={24} />
                  </a>
                )}
                {passport.socials?.email && (
                  <a href={`mailto:${passport.socials.email}`} aria-label="Email">
                    <SocialIcon type="mail" size={24} />
                  </a>
                )}
              </div>
            </div>
            
            {/* About Section */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Briefcase className="h-5 w-5 text-blue-500" />
                About
              </h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-muted-foreground">
                  Web3 professional with blockchain expertise. Active on Ethereum since {firstTransactionDate}.
                  Skilled in decentralized applications and blockchain development with a strong on-chain presence.
                </p>
              </div>
            </div>
            
            {/* Skills Section - Only showing TalentProtocol skills */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Award className="h-5 w-5 text-blue-500" />
                Skills & Expertise
                <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full ml-2">
                  TalentProtocol Verified
                </span>
              </h3>
              {verifiedSkills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {verifiedSkills.map((skill, idx) => (
                    <Badge 
                      key={`${skill.name}-${idx}`} 
                      variant="secondary"
                      className="text-sm py-1 px-3 bg-blue-50 text-blue-700 hover:bg-blue-100"
                    >
                      {skill.name}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground italic">
                  No TalentProtocol verified skills available
                </p>
              )}
            </div>
            
            {/* Featured Box Usernames */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Box className="h-5 w-5 text-blue-500" />
                Featured .box Domains
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {boxUsernames.map((username, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                    <div className="bg-blue-100 p-2 rounded-md">
                      <Box className="h-4 w-4 text-blue-600" />
                    </div>
                    <span className="font-medium">{username}</span>
                    <ChevronRight className="h-4 w-4 text-muted-foreground ml-auto" />
                  </div>
                ))}
              </div>
            </div>
            
            {/* Blockchain Metrics */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <Activity className="h-5 w-5 text-blue-500" />
                Blockchain Activity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">ETH Balance</h4>
                  <p className="text-lg font-bold">{blockchainProfile?.balance || "0"} ETH</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Transactions</h4>
                  <p className="text-lg font-bold">{blockchainProfile?.transactionCount || "0"}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Active Since</h4>
                  <p className="text-lg font-bold">{firstTransactionDate}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Mirror.xyz</h4>
                  <p className="text-lg font-bold">3 posts</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Lens Protocol</h4>
                  <p className="text-lg font-bold">12 activities</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">SNS.ID</h4>
                  <p className="text-lg font-bold">Active</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-6">
        <Button onClick={onExportPdf} className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
          <Download className="h-4 w-4 mr-2" />
          Download Resume as PDF
        </Button>
      </div>
    </>
  );
};

export default ResumeTab;
