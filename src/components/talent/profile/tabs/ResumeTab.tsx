
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { truncateAddress } from '@/lib/utils';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { PassportSkill } from '@/api/types/web3Types';

interface ResumeTabProps {
  passport: {
    passport_id: string;
    owner_address: string;
    skills: PassportSkill[];
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

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Resume
          </CardTitle>
          <CardDescription>
            Professional profile and skills
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium">About</h3>
              <p className="mt-2 text-muted-foreground">
                Web3 professional with blockchain expertise. Active on Ethereum since {firstTransactionDate}.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Skills & Expertise</h3>
              <div className="mt-2 flex flex-wrap gap-2">
                {passport.skills.map((skill, idx) => (
                  <Badge 
                    key={`${skill.name}-${idx}`} 
                    variant={skill.proof ? "default" : "secondary"}
                  >
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium">Blockchain Metrics</h3>
              <div className="mt-2 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Ethereum Address</span>
                  <span className="font-medium">{truncateAddress(passport.owner_address)}</span>
                </div>
                {resolvedEns && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ENS Name</span>
                    <span className="font-medium">{resolvedEns}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">ETH Balance</span>
                  <span className="font-medium">{blockchainProfile?.balance || "0"} ETH</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction Count</span>
                  <span className="font-medium">{blockchainProfile?.transactionCount || "0"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Human Score</span>
                  <span className={`font-medium text-${passport.score >= 80 ? 'green' : passport.score >= 60 ? 'blue' : passport.score >= 40 ? 'yellow' : 'red'}-500`}>
                    {passport.score} ({passport.category})
                  </span>
                </div>
              </div>
            </div>
            
            <div className="resumetab-socials">
              <h3 className="text-lg font-medium">Contact Information</h3>
              <div className="mt-2 space-y-2">
                {passport.socials?.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <a href={`mailto:${passport.socials.email}`} className="font-medium text-blue-500 hover:underline">
                      {passport.socials.email}
                    </a>
                  </div>
                )}
                {passport.socials?.github && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">GitHub</span>
                    <a href={passport.socials.github} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                      {passport.socials.github.replace('https://github.com/', '')}
                    </a>
                  </div>
                )}
                {passport.socials?.twitter && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Twitter</span>
                    <a href={passport.socials.twitter} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                      {passport.socials.twitter.replace('https://twitter.com/', '@')}
                    </a>
                  </div>
                )}
                {passport.socials?.linkedin && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">LinkedIn</span>
                    <a href={passport.socials.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                      View Profile
                    </a>
                  </div>
                )}
                {passport.socials?.website && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Website</span>
                    <a href={passport.socials.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                      {passport.socials.website.replace(/^https?:\/\//, '')}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="text-center mt-6">
        <Button onClick={onExportPdf}>
          <Download className="h-4 w-4 mr-2" />
          Download as PDF
        </Button>
      </div>
    </>
  );
};

export default ResumeTab;
