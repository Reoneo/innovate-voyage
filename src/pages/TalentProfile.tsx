
import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download, Github, Linkedin, Twitter, Globe, Mail, Award, FileText, Coins } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { calculateHumanScore, getScoreColorClass, truncateAddress } from '@/lib/utils';
import { useEnsByAddress, useAddressByEns, useWeb3BioProfile } from '@/hooks/useWeb3';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { BlockchainPassport } from '@/lib/utils';
import { ChartContainer } from '@/components/ui/chart';
import { toast } from '@/components/ui/use-toast';
import SkillsNodeLeafD3 from '@/components/visualizations/skills/SkillsNodeLeafD3';
import SkillsStatsChart from '@/components/visualizations/skills/SkillsStatsChart';
import SkillsNetworkGraph from '@/components/visualizations/skills/SkillsNetworkGraph';
import TransactionHistoryChart from '@/components/visualizations/transactions/TransactionHistoryChart';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const TalentProfile = () => {
  const { ensName, address } = useParams<{ ensName: string; address: string }>();
  const [passport, setPassport] = useState<BlockchainPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);
  
  // Fetch data based on ENS or address
  const { data: addressData } = useAddressByEns(
    ensName?.includes('.eth') ? ensName : undefined
  );
  const { data: ensData } = useEnsByAddress(
    !ensName?.includes('.eth') ? address : undefined
  );
  
  // Get blockchain data
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 20);
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 10);
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);

  // Create passport from gathered data
  useEffect(() => {
    const createPassport = async () => {
      if (!resolvedAddress) return;
      
      setLoading(true);
      
      try {
        // Create skills from available data
        const skills = [];
        
        // Add skills based on blockchain activity
        if (blockchainProfile) {
          if (parseFloat(blockchainProfile.balance) > 0) skills.push({ name: 'ETH Holder', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 10) skills.push({ name: 'Active Trader', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 50) skills.push({ name: 'Power User', proof: `etherscan://${resolvedAddress}` });
        }
        
        // Add ENS-related skill
        if (resolvedEns?.includes('.eth')) skills.push({ name: 'ENS Owner', proof: `ens://${resolvedEns}` });
        
        // Add skills from transactions
        if (transactions && transactions.length > 0) {
          const hasContractInteractions = transactions.some(tx => tx.input && tx.input !== '0x');
          if (hasContractInteractions) skills.push({ name: 'Smart Contract User', proof: `etherscan://${resolvedAddress}` });
          
          // Check for recent activity
          const recentTx = transactions.some(tx => {
            const txDate = new Date(parseInt(tx.timeStamp) * 1000);
            const now = new Date();
            const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
            return daysDiff < 30;
          });
          
          if (recentTx) skills.push({ name: 'Recently Active', proof: `etherscan://${resolvedAddress}` });
        }
        
        // Add token holder skills
        if (tokenTransfers && tokenTransfers.length > 0) {
          const uniqueTokens = new Set(tokenTransfers.map(tx => tx.tokenSymbol));
          if (uniqueTokens.size > 0) skills.push({ name: 'Token Holder', proof: `etherscan://${resolvedAddress}` });
          if (uniqueTokens.size > 5) skills.push({ name: 'Token Collector', proof: `etherscan://${resolvedAddress}` });
          
          // Check for specific tokens
          if (Array.from(uniqueTokens).some(token => token === 'UNI')) {
            skills.push({ name: 'Uniswap User', proof: `etherscan://${resolvedAddress}` });
          }
        }
        
        // Add web3bio skills
        if (web3BioProfile) {
          if (web3BioProfile.github) skills.push({ name: 'GitHub User', proof: web3BioProfile.github });
          if (web3BioProfile.twitter) skills.push({ name: 'Twitter User', proof: web3BioProfile.twitter });
          if (web3BioProfile.linkedin) skills.push({ name: 'LinkedIn User', proof: web3BioProfile.linkedin });
        }
        
        // Create passport object
        const newPassport: BlockchainPassport = {
          passport_id: resolvedEns || truncateAddress(resolvedAddress),
          owner_address: resolvedAddress,
          avatar_url: web3BioProfile?.avatar || '/placeholder.svg',
          name: resolvedEns ? resolvedEns.split('.')[0] : truncateAddress(resolvedAddress),
          issued: new Date().toISOString(),
          skills: skills,
          socials: {
            github: web3BioProfile?.github,
            twitter: web3BioProfile?.twitter,
            linkedin: web3BioProfile?.linkedin,
            website: web3BioProfile?.website,
            email: web3BioProfile?.email
          }
        };
        
        setPassport(newPassport);
      } catch (error) {
        console.error('Error creating passport:', error);
        toast({
          title: 'Error loading profile',
          description: 'Could not load blockchain data for this profile',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (resolvedAddress) {
      createPassport();
    }
  }, [resolvedAddress, resolvedEns, blockchainProfile, transactions, tokenTransfers, web3BioProfile]);

  // Export profile as PDF
  const exportAsPDF = async () => {
    if (!profileRef.current) return;
    
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we generate your PDF...'
      });
      
      const canvas = await html2canvas(profileRef.current, {
        scale: 2,
        useCORS: true,
        logging: false
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${passport?.passport_id || 'blockchain-profile'}.pdf`);
      
      toast({
        title: 'PDF Generated',
        description: 'Your PDF has been successfully generated!'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'There was an error generating your PDF',
        variant: 'destructive'
      });
    }
  };

  // If we have a valid passport, calculate score
  const passportWithScore = passport ? {
    ...passport,
    ...calculateHumanScore(passport),
    hasMoreSkills: passport.skills.length > 4
  } : null;

  return (
    <div className="container mx-auto py-8 max-w-5xl">
      {/* Header with navigation */}
      <div className="flex justify-between items-center mb-6">
        <Link to="/talent" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Talent
        </Link>
        <Button onClick={exportAsPDF} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export as PDF
        </Button>
      </div>
      
      {loading ? (
        <ProfileSkeleton />
      ) : passportWithScore ? (
        <div ref={profileRef} className="space-y-6">
          {/* Profile Header Card */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={passportWithScore.avatar_url} />
                  <AvatarFallback>{passportWithScore.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                </Avatar>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                    <div>
                      <CardTitle className="text-2xl">{passportWithScore.passport_id}</CardTitle>
                      <CardDescription className="text-base">
                        {truncateAddress(passportWithScore.owner_address)}
                      </CardDescription>
                      
                      <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                        {passportWithScore.socials?.github && (
                          <a href={passportWithScore.socials.github} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Github className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {passportWithScore.socials?.twitter && (
                          <a href={passportWithScore.socials.twitter} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Twitter className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {passportWithScore.socials?.linkedin && (
                          <a href={passportWithScore.socials.linkedin} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Linkedin className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {passportWithScore.socials?.website && (
                          <a href={passportWithScore.socials.website} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="sm">
                              <Globe className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                        {passportWithScore.socials?.email && (
                          <a href={`mailto:${passportWithScore.socials.email}`}>
                            <Button variant="outline" size="sm">
                              <Mail className="h-4 w-4" />
                            </Button>
                          </a>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-center">
                      <div className={`text-5xl font-bold ${getScoreColorClass(passportWithScore.score)}`}>
                        {passportWithScore.score}
                      </div>
                      <div className="text-sm text-muted-foreground mt-1">Human Score</div>
                      <div className="mt-2">
                        <Badge className="text-xs">{passportWithScore.category}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
          </Card>
          
          {/* Tabs for different sections */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid grid-cols-4 md:w-[600px] mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
              <TabsTrigger value="skills">Skills</TabsTrigger>
              <TabsTrigger value="resume">Resume</TabsTrigger>
            </TabsList>
            
            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Skills Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Award className="h-5 w-5" /> Skills & Expertise
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {passportWithScore.skills.map((skill, idx) => (
                        <Badge 
                          key={`${skill.name}-${idx}`} 
                          variant={skill.proof ? "default" : "secondary"}
                        >
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                    
                    <div className="mt-4 h-60">
                      <SkillsNodeLeafD3 
                        skills={passportWithScore.skills} 
                        name={passportWithScore.name} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                {/* Blockchain Activity */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Coins className="h-5 w-5" /> Blockchain Activity
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">ETH Balance</div>
                        <div className="font-medium">{blockchainProfile?.balance || "0"} ETH</div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-sm text-muted-foreground">Transactions</div>
                        <div className="font-medium">{blockchainProfile?.transactionCount || "0"}</div>
                      </div>
                      
                      {transactions && transactions.length > 0 && (
                        <div className="h-48 mt-6">
                          <TransactionHistoryChart transactions={transactions} address={passportWithScore.owner_address} />
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Blockchain Tab */}
            <TabsContent value="blockchain" className="space-y-6 mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Transaction History</CardTitle>
                  <CardDescription>
                    Recent blockchain transactions for {passportWithScore.passport_id}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {transactions && transactions.length > 0 ? (
                    <div className="space-y-8">
                      <div className="h-64">
                        <TransactionHistoryChart 
                          transactions={transactions} 
                          address={passportWithScore.owner_address}
                          showLabels={true}
                        />
                      </div>
                      
                      <div className="border rounded-lg overflow-hidden">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="p-2 text-left">Date</th>
                              <th className="p-2 text-left">Type</th>
                              <th className="p-2 text-left">Value</th>
                              <th className="p-2 text-left">Hash</th>
                            </tr>
                          </thead>
                          <tbody>
                            {transactions.slice(0, 10).map((tx, idx) => {
                              const date = new Date(parseInt(tx.timeStamp) * 1000);
                              const isSent = tx.from.toLowerCase() === passportWithScore.owner_address.toLowerCase();
                              const value = parseFloat(tx.value) / 1e18;
                              
                              return (
                                <tr key={idx} className="border-t border-border">
                                  <td className="p-2">{date.toLocaleDateString()}</td>
                                  <td className="p-2">
                                    <Badge variant={isSent ? "destructive" : "default"}>
                                      {isSent ? 'Sent' : 'Received'}
                                    </Badge>
                                  </td>
                                  <td className="p-2 font-medium">{value.toFixed(4)} ETH</td>
                                  <td className="p-2 truncate max-w-[150px]">
                                    <a 
                                      href={`https://etherscan.io/tx/${tx.hash}`} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-500 hover:underline"
                                    >
                                      {tx.hash.substring(0, 8)}...{tx.hash.substring(tx.hash.length - 8)}
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No transaction history found for this address
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Skills Tab */}
            <TabsContent value="skills" className="space-y-6 mt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Visualization</CardTitle>
                    <CardDescription>
                      Interactive visualization of {passportWithScore.name}'s skills
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <SkillsNodeLeafD3 
                        skills={passportWithScore.skills} 
                        name={passportWithScore.name} 
                      />
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Skills Network</CardTitle>
                    <CardDescription>
                      Connections between skills and projects
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-96">
                      <SkillsNetworkGraph 
                        skills={passportWithScore.skills} 
                        name={passportWithScore.name} 
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            {/* Resume Tab */}
            <TabsContent value="resume" className="space-y-6 mt-6">
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
                        Web3 professional with blockchain expertise. Active on Ethereum since {
                          blockchainProfile?.firstTransactionDate 
                            ? new Date(parseInt(blockchainProfile.firstTransactionDate) * 1000).getFullYear() 
                            : 'recent years'
                        }.
                      </p>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Skills & Expertise</h3>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {passportWithScore.skills.map((skill, idx) => (
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
                          <span className="font-medium">{truncateAddress(passportWithScore.owner_address)}</span>
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
                          <span className={`font-medium ${getScoreColorClass(passportWithScore.score)}`}>
                            {passportWithScore.score} ({passportWithScore.category})
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-medium">Contact Information</h3>
                      <div className="mt-2 space-y-2">
                        {passportWithScore.socials?.email && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Email</span>
                            <a href={`mailto:${passportWithScore.socials.email}`} className="font-medium text-blue-500 hover:underline">
                              {passportWithScore.socials.email}
                            </a>
                          </div>
                        )}
                        {passportWithScore.socials?.github && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">GitHub</span>
                            <a href={passportWithScore.socials.github} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                              {passportWithScore.socials.github.replace('https://github.com/', '')}
                            </a>
                          </div>
                        )}
                        {passportWithScore.socials?.twitter && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Twitter</span>
                            <a href={passportWithScore.socials.twitter} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                              {passportWithScore.socials.twitter.replace('https://twitter.com/', '@')}
                            </a>
                          </div>
                        )}
                        {passportWithScore.socials?.linkedin && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">LinkedIn</span>
                            <a href={passportWithScore.socials.linkedin} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                              View Profile
                            </a>
                          </div>
                        )}
                        {passportWithScore.socials?.website && (
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Website</span>
                            <a href={passportWithScore.socials.website} target="_blank" rel="noopener noreferrer" className="font-medium text-blue-500 hover:underline">
                              {passportWithScore.socials.website.replace(/^https?:\/\//, '')}
                            </a>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <div className="text-center">
                <Button onClick={exportAsPDF}>
                  <Download className="h-4 w-4 mr-2" />
                  Download as PDF
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
          <p className="text-muted-foreground mb-6">Could not load profile information for this user</p>
          <Link to="/talent">
            <Button>Return to Talent Search</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

// Loading skeleton component
const ProfileSkeleton = () => (
  <div className="space-y-6">
    <Card>
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          <Skeleton className="h-24 w-24 rounded-full" />
          <div className="flex-1 space-y-4 w-full">
            <Skeleton className="h-8 w-48 mx-auto md:mx-0" />
            <Skeleton className="h-4 w-32 mx-auto md:mx-0" />
            <div className="flex gap-2 flex-wrap justify-center md:justify-start">
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
              <Skeleton className="h-8 w-8 rounded-md" />
            </div>
          </div>
          <div className="flex flex-col items-center">
            <Skeleton className="h-12 w-12 rounded-full" />
            <Skeleton className="h-4 w-24 mt-2" />
          </div>
        </div>
      </CardHeader>
    </Card>
    
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid grid-cols-4 md:w-[600px] mx-auto">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
        <TabsTrigger value="skills">Skills</TabsTrigger>
        <TabsTrigger value="resume">Resume</TabsTrigger>
      </TabsList>
      
      <TabsContent value="overview" className="space-y-6 mt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
              </div>
              <Skeleton className="h-60 w-full rounded-md" />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-8" />
                </div>
              </div>
              <Skeleton className="h-48 w-full rounded-md" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  </div>
);

export default TalentProfile;
