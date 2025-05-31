
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { MapPin, Mail, Globe, Github, Twitter, Calendar, Coins, ArrowUpRight } from 'lucide-react';
import GitHubContributionGraph from '../github/GitHubContributionGraph';
import PoapSection from '../poap/PoapSection';
import { useBlockchainActivity } from '@/hooks/useBlockchainActivity';
import { useScoresData } from '@/hooks/useScoresData';
import { useWebacyData } from '@/hooks/useWebacyData';
import { getBuilderTitle } from '../scores/utils/scoreUtils';

interface CVStyleLayoutProps {
  passport: any;
  ensNameOrAddress?: string;
  githubUsername: string | null;
  showGitHubSection: boolean;
}

const CVStyleLayout: React.FC<CVStyleLayoutProps> = ({
  passport,
  ensNameOrAddress,
  githubUsername,
  showGitHubSection
}) => {
  const { data: blockchainData } = useBlockchainActivity(passport.owner_address);
  const { score } = useScoresData(passport.owner_address);
  const { securityData } = useWebacyData(passport.owner_address);

  return (
    <div className="max-w-4xl mx-auto bg-white shadow-lg">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
        <div className="flex items-start gap-6">
          <Avatar className="h-32 w-32 border-4 border-white">
            <AvatarImage src={passport.avatar_url} alt={passport.name} />
            <AvatarFallback className="text-2xl">
              {passport.name?.substring(0, 2).toUpperCase() || ensNameOrAddress?.substring(0, 2).toUpperCase() || '??'}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-2">
              {passport.name || ensNameOrAddress || 'Anonymous User'}
            </h1>
            {score && (
              <p className="text-xl mb-4 opacity-90">
                {getBuilderTitle(score)} • Builder Score: {score}
              </p>
            )}
            {passport.bio && (
              <p className="text-lg opacity-90 mb-4">{passport.bio}</p>
            )}
            
            {/* Contact Information */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm">
                    {passport.owner_address.substring(0, 6)}...{passport.owner_address.substring(-4)}
                  </span>
                </div>
                {passport.socials?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{passport.socials.email}</span>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                {passport.socials?.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    <a href={passport.socials.website} className="text-sm hover:underline">
                      Website
                    </a>
                  </div>
                )}
                {passport.socials?.github && (
                  <div className="flex items-center gap-2">
                    <Github className="h-4 w-4" />
                    <a href={`https://github.com/${githubUsername}`} className="text-sm hover:underline">
                      GitHub
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-8 space-y-8">
        {/* Summary Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Professional Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Blockchain Activity */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Blockchain Activity</h4>
                {blockchainData.firstTransaction && (
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span>First TX: {blockchainData.firstTransaction}</span>
                  </div>
                )}
                {blockchainData.ethBalance && (
                  <div className="flex items-center gap-2 text-sm">
                    <Coins className="h-4 w-4 text-gray-500" />
                    <span>ETH: {blockchainData.ethBalance}</span>
                  </div>
                )}
                {blockchainData.outgoingTransactions !== null && (
                  <div className="flex items-center gap-2 text-sm">
                    <ArrowUpRight className="h-4 w-4 text-gray-500" />
                    <span>TXs: {blockchainData.outgoingTransactions}</span>
                  </div>
                )}
              </div>

              {/* Security Score */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Security Profile</h4>
                {securityData?.riskScore !== undefined && (
                  <div className="text-sm">
                    <span>Risk Score: </span>
                    <Badge variant={securityData.riskScore < 30 ? "default" : securityData.riskScore < 70 ? "secondary" : "destructive"}>
                      {securityData.riskScore}/100
                    </Badge>
                  </div>
                )}
                {securityData?.threatLevel && (
                  <div className="text-sm">
                    <span>Threat Level: </span>
                    <Badge variant={securityData.threatLevel === 'LOW' ? "default" : securityData.threatLevel === 'MEDIUM' ? "secondary" : "destructive"}>
                      {securityData.threatLevel}
                    </Badge>
                  </div>
                )}
              </div>

              {/* ENS Domains */}
              <div className="space-y-2">
                <h4 className="font-semibold text-gray-700">Digital Identity</h4>
                {ensNameOrAddress && (
                  <div className="text-sm">
                    <Badge variant="outline">{ensNameOrAddress}</Badge>
                  </div>
                )}
                {passport.additionalEnsDomains && passport.additionalEnsDomains.length > 0 && (
                  <div className="space-y-1">
                    {passport.additionalEnsDomains.map((domain, index) => (
                      <div key={index} className="text-sm">
                        <Badge variant="outline">{domain}</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Skills Section */}
        {passport.skills && passport.skills.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Skills & Expertise</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {passport.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-sm">
                    {skill.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* GitHub Contributions */}
        {showGitHubSection && githubUsername && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <Github className="h-5 w-5" />
                GitHub Contributions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <GitHubContributionGraph username={githubUsername} />
            </CardContent>
          </Card>
        )}

        {/* POAPs Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Proof of Attendance Protocols (POAPs)</CardTitle>
          </CardHeader>
          <CardContent>
            <PoapSection walletAddress={passport.owner_address} />
          </CardContent>
        </Card>

        {/* Social Links */}
        {passport.socials && Object.keys(passport.socials).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Professional Links</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(passport.socials).map(([platform, value]) => {
                  if (!value || platform === 'email') return null;
                  
                  let href = '';
                  let icon = <Globe className="h-4 w-4" />;
                  
                  switch (platform) {
                    case 'github':
                      href = `https://github.com/${value}`;
                      icon = <Github className="h-4 w-4" />;
                      break;
                    case 'twitter':
                      href = `https://twitter.com/${value}`;
                      icon = <Twitter className="h-4 w-4" />;
                      break;
                    case 'website':
                      href = value.startsWith('http') ? value : `https://${value}`;
                      break;
                    default:
                      href = value.startsWith('http') ? value : `https://${value}`;
                  }
                  
                  return (
                    <a
                      key={platform}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 p-2 rounded-lg border hover:bg-gray-50 transition-colors"
                    >
                      {icon}
                      <span className="text-sm capitalize">{platform}</span>
                    </a>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CVStyleLayout;
