
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText, Download, Briefcase, Award, Activity, Link as LinkIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { truncateAddress } from '@/lib/utils';
import { BlockchainProfile } from '@/api/types/etherscanTypes';
import { SocialIcon } from '@/components/ui/social-icon';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

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
      facebook?: string;
      whatsapp?: string;
      bluesky?: string;
      instagram?: string;
      youtube?: string;
      discord?: string;
      telegram?: string;
      reddit?: string;
      messenger?: string;
    };
  };
  blockchainProfile?: BlockchainProfile | null;
  resolvedEns?: string;
  onExportPdf: () => void;
  avatarUrl?: string;
}

interface SocialProfiles {
  twitter?: string;
  github?: string;
  linkedin?: string;
  discord?: string;
  website?: string;
  email?: string;
  facebook?: string;
  whatsapp?: string;
  messenger?: string;
  reddit?: string;
  telegram?: string;
  instagram?: string;
  youtube?: string;
  bluesky?: string;
}

const ResumeTab: React.FC<ResumeTabProps> = ({ 
  passport, 
  blockchainProfile, 
  resolvedEns,
  onExportPdf,
  avatarUrl
}) => {
  // Calculate first transaction date if available
  const firstTransactionDate = blockchainProfile?.latestTransactions?.length 
    ? new Date(Math.min(...blockchainProfile.latestTransactions.map(tx => parseInt(tx.timeStamp) * 1000))).getFullYear()
    : 'recent years';

  // Function to format URLs properly
  const formatUrl = (url: string | undefined) => {
    if (!url) return '';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url;
    }
    return `https://${url}`;
  };

  // Format WhatsApp numbers
  const formatWhatsAppUrl = (number: string | undefined) => {
    if (!number) return '';
    // Remove any non-numeric characters
    const cleanNumber = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNumber}`;
  };

  // Format Bluesky handle
  const formatBlueskyUrl = (handle: string | undefined) => {
    if (!handle) return '';
    if (handle.startsWith('http')) return handle;
    return `https://bsky.app/profile/${handle.startsWith('@') ? handle.substring(1) : handle}`;
  };

  const blockchainProfileSocials = blockchainProfile?.socials as SocialProfiles || {};

  return (
    <>
      <Card id="resume-pdf" className="bg-white print:shadow-none">
        <CardHeader className="pb-2 border-b">
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2 text-2xl">
              <FileText className="h-6 w-6" />
              Blockchain Resume
            </CardTitle>
            <div className="flex items-center gap-2">
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-3 py-1 rounded-full text-sm">
                {passport.score} • {passport.category}
              </div>
              <div className="bg-gradient-to-r from-green-500 to-teal-600 text-white px-3 py-1 rounded-full text-sm">
                TP Score: 85
              </div>
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
              <div className="flex flex-wrap gap-3">
                {passport.socials?.github && (
                  <a href={formatUrl(passport.socials.github)} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
                    <SocialIcon type="github" size={24} />
                  </a>
                )}
                {passport.socials?.twitter && (
                  <a href={formatUrl(passport.socials.twitter)} target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                    <SocialIcon type="twitter" size={24} />
                  </a>
                )}
                {passport.socials?.facebook && (
                  <a href={formatUrl(passport.socials.facebook)} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <SocialIcon type="facebook" size={24} />
                  </a>
                )}
                {passport.socials?.linkedin && (
                  <a href={formatUrl(passport.socials.linkedin)} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                    <SocialIcon type="linkedin" size={24} />
                  </a>
                )}
                {passport.socials?.bluesky && (
                  <a href={formatBlueskyUrl(passport.socials.bluesky)} target="_blank" rel="noopener noreferrer" aria-label="Bluesky">
                    <SocialIcon type="bluesky" size={24} />
                  </a>
                )}
                {passport.socials?.whatsapp && (
                  <a href={formatWhatsAppUrl(passport.socials.whatsapp)} target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
                    <SocialIcon type="whatsapp" size={24} />
                  </a>
                )}
                {passport.socials?.instagram && (
                  <a href={formatUrl(passport.socials.instagram)} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <SocialIcon type="instagram" size={24} />
                  </a>
                )}
                {passport.socials?.youtube && (
                  <a href={formatUrl(passport.socials.youtube)} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <SocialIcon type="youtube" size={24} />
                  </a>
                )}
                {passport.socials?.website && (
                  <a href={formatUrl(passport.socials.website)} target="_blank" rel="noopener noreferrer" aria-label="Website">
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
            
            {/* Links Section - Replacing Skills & Expertise */}
            <div className="space-y-2">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <LinkIcon className="h-5 w-5 text-blue-500" />
                Links
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {/* ENS Domain Links */}
                <div>
                  <h4 className="font-medium text-sm mb-2">ENS Domains</h4>
                  <TooltipProvider>
                    {resolvedEns && (
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <a 
                            href={`https://app.ens.domains/name/${resolvedEns}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors mb-2 mr-2"
                          >
                            <Badge className="bg-blue-200 text-blue-800">.eth</Badge>
                            {resolvedEns}
                          </a>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>View on ENS App</p>
                        </TooltipContent>
                      </Tooltip>
                    )}

                    {blockchainProfile?.ensLinks?.filter(link => link !== resolvedEns).map((link, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://app.ens.domains/name/${link}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors mb-2 mr-2"
                            >
                              <Badge className="bg-blue-200 text-blue-800">.eth</Badge>
                              {link}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on ENS App</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}

                    {blockchainProfile?.boxDomains?.map((domain, idx) => (
                      <TooltipProvider key={idx}>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <a 
                              href={`https://optimism.ens.domains/name/${domain}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors mb-2 mr-2"
                            >
                              <Badge className="bg-red-200 text-red-800">.box</Badge>
                              {domain}
                            </a>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View on Optimism ENS</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                  </TooltipProvider>
                </div>

                {/* Social Links */}
                <div>
                  <h4 className="font-medium text-sm mb-2">Social Profiles</h4>
                  <div className="flex flex-wrap gap-2">
                    {(blockchainProfileSocials?.github || passport.socials?.github) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.github || passport.socials?.github)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                      >
                        <SocialIcon type="github" size={16} />
                        GitHub
                      </a>
                    )}
                    {(blockchainProfileSocials?.twitter || passport.socials?.twitter) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.twitter || passport.socials?.twitter)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="twitter" size={16} />
                        Twitter
                      </a>
                    )}
                    {(blockchainProfileSocials?.facebook || passport.socials?.facebook) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.facebook || passport.socials?.facebook)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="facebook" size={16} />
                        Facebook
                      </a>
                    )}
                    {(blockchainProfileSocials?.linkedin || passport.socials?.linkedin) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.linkedin || passport.socials?.linkedin)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="linkedin" size={16} />
                        LinkedIn
                      </a>
                    )}
                    {(blockchainProfileSocials?.bluesky || passport.socials?.bluesky) && (
                      <a 
                        href={formatBlueskyUrl(blockchainProfileSocials?.bluesky || passport.socials?.bluesky)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-sky-50 hover:bg-sky-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="bluesky" size={16} />
                        Bluesky
                      </a>
                    )}
                    {(blockchainProfileSocials?.whatsapp || passport.socials?.whatsapp) && (
                      <a 
                        href={formatWhatsAppUrl(blockchainProfileSocials?.whatsapp || passport.socials?.whatsapp)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="whatsapp" size={16} />
                        WhatsApp
                      </a>
                    )}
                    {(blockchainProfileSocials?.instagram || passport.socials?.instagram) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.instagram || passport.socials?.instagram)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-pink-50 hover:bg-pink-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="instagram" size={16} />
                        Instagram
                      </a>
                    )}
                    {(blockchainProfileSocials?.youtube || passport.socials?.youtube) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.youtube || passport.socials?.youtube)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-50 hover:bg-red-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="youtube" size={16} />
                        YouTube
                      </a>
                    )}
                    {(blockchainProfileSocials?.website || passport.socials?.website) && (
                      <a 
                        href={formatUrl(blockchainProfileSocials?.website || passport.socials?.website)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-50 hover:bg-green-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="globe" size={16} />
                        Website
                      </a>
                    )}
                    {(blockchainProfileSocials?.email || passport.socials?.email) && (
                      <a 
                        href={`mailto:${blockchainProfileSocials?.email || passport.socials?.email}`}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 hover:bg-purple-100 rounded-md transition-colors"
                      >
                        <SocialIcon type="mail" size={16} />
                        Email
                      </a>
                    )}
                  </div>
                </div>
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
                  <p className="text-lg font-bold">{blockchainProfile?.mirrorPosts || 3} posts</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">Lens Protocol</h4>
                  <p className="text-lg font-bold">{blockchainProfile?.lensActivity || 12} activities</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm text-muted-foreground mb-1">SNS.ID</h4>
                  <p className="text-lg font-bold">{blockchainProfile?.snsActive ? "Active" : "Inactive"}</p>
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
