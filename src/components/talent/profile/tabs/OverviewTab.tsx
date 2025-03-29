
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { Activity, Link as LinkIcon } from 'lucide-react';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';
import SkillsVisualization from '@/components/visualizations/SkillsVisualization';
import { Badge } from '@/components/ui/badge';
import { SocialIcon } from '@/components/ui/social-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface OverviewTabProps {
  skills: Array<{ name: string; proof?: string }>;
  name: string;
  blockchainProfile?: BlockchainProfile | null;
  transactions?: any[] | null;
  address: string;
  blockchainExtendedData?: {
    mirrorPosts: number;
    lensActivity: number;
    boxDomains: string[];
    snsActive: boolean;
  };
}

const OverviewTab: React.FC<OverviewTabProps> = ({ 
  skills, 
  name, 
  blockchainProfile, 
  transactions,
  address,
  blockchainExtendedData
}) => {
  // Format URLs properly
  const formatUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };
  
  const socials = blockchainProfile?.socials || {};
  const ensLinks = blockchainProfile?.ensLinks || [];
  const hasSocials = socials && Object.values(socials).some(Boolean);
  const hasEnsLinks = ensLinks && ensLinks.length > 0;
  const hasBoxDomains = blockchainExtendedData?.boxDomains && blockchainExtendedData?.boxDomains.length > 0;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Links Section - Replaced Skills & Expertise */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <LinkIcon className="h-5 w-5" />
            Links
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* ENS Domains */}
            {(blockchainExtendedData?.boxDomains?.length > 0 || ensLinks?.length > 0) && (
              <div>
                <h4 className="font-medium text-sm mb-2">ENS Domains</h4>
                <div className="flex flex-wrap gap-2">
                  <TooltipProvider>
                    {blockchainExtendedData?.boxDomains?.map((domain, idx) => (
                      <Tooltip key={`box-${idx}`}>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://optimism.ens.domains/name/${domain}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors"
                          >
                            <Badge className="bg-red-200 text-red-800">.box</Badge>
                            {domain}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on Optimism ENS</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                    
                    {ensLinks?.map((link, idx) => (
                      <Tooltip key={`ens-${idx}`}>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://app.ens.domains/name/${link}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors"
                          >
                            <Badge className="bg-blue-200 text-blue-800">.eth</Badge>
                            {link}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on ENS App</p>
                        </TooltipContent>
                      </Tooltip>
                    ))}
                  </TooltipProvider>
                </div>
              </div>
            )}

            {/* Social Links */}
            {hasSocials && (
              <div>
                <h4 className="font-medium text-sm mb-2">Social Profiles</h4>
                <div className="flex flex-wrap gap-2">
                  {socials?.github && (
                    <a 
                      href={formatUrl(socials.github)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                    >
                      <SocialIcon type="github" size={16} />
                      GitHub
                    </a>
                  )}
                  {socials?.twitter && (
                    <a 
                      href={formatUrl(socials.twitter)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <SocialIcon type="twitter" size={16} />
                      Twitter
                    </a>
                  )}
                  {socials?.linkedin && (
                    <a 
                      href={formatUrl(socials.linkedin)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                    >
                      <SocialIcon type="linkedin" size={16} />
                      LinkedIn
                    </a>
                  )}
                  {socials?.website && (
                    <a 
                      href={formatUrl(socials.website)} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                    >
                      <SocialIcon type="globe" size={16} />
                      Website
                    </a>
                  )}
                  {socials?.email && (
                    <a 
                      href={`mailto:${socials.email}`}
                      className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                    >
                      <SocialIcon type="mail" size={16} />
                      Email
                    </a>
                  )}
                </div>
              </div>
            )}

            {/* Show skills visualization if there are skills */}
            {skills && skills.length > 0 && (
              <div className="mt-6">
                <h4 className="font-medium text-sm mb-3">Skills Graph</h4>
                <div className="h-[240px] w-full">
                  <SkillsVisualization skills={skills} name={name} />
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Transaction History */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <TransactionHistoryChart transactions={transactions || []} />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OverviewTab;
