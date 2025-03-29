import React, { useEffect, useState, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TooltipProvider } from '@/components/ui/tooltip';
import { calculateHumanScore, truncateAddress } from '@/lib/utils';
import { useEnsByAddress, useAddressByEns, useWeb3BioProfile } from '@/hooks/useWeb3';
import { useBlockchainProfile, useLatestTransactions, useTokenTransfers } from '@/hooks/useEtherscan';
import { BlockchainPassport } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import OverviewTab from '@/components/talent/profile/tabs/OverviewTab';
import BlockchainTab from '@/components/talent/profile/tabs/BlockchainTab';
import SkillsTab from '@/components/talent/profile/tabs/SkillsTab';
import ResumeTab from '@/components/talent/profile/tabs/ResumeTab';

import { fetchBlockchainData } from '@/api/services/blockchainDataService';

const TalentProfile = () => {
  const { ensName, address } = useParams<{ ensName: string; address: string }>();
  const [passport, setPassport] = useState<BlockchainPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const profileRef = useRef<HTMLDivElement>(null);
  
  const { data: addressData } = useAddressByEns(
    ensName?.includes('.eth') ? ensName : undefined
  );
  const { data: ensData } = useEnsByAddress(
    !ensName?.includes('.eth') ? address : undefined
  );
  
  const resolvedAddress = addressData?.address || address;
  const resolvedEns = ensName || ensData?.ensName;
  
  const { data: blockchainProfile, isLoading: loadingBlockchain } = useBlockchainProfile(resolvedAddress);
  const { data: transactions } = useLatestTransactions(resolvedAddress, 20);
  const { data: tokenTransfers } = useTokenTransfers(resolvedAddress, 10);
  const { data: web3BioProfile } = useWeb3BioProfile(resolvedAddress || resolvedEns);
  
  const [blockchainData, setBlockchainData] = useState({
    mirrorPosts: 0,
    lensActivity: 0,
    boxDomains: [],
    snsActive: false
  });

  useEffect(() => {
    const loadBlockchainData = async () => {
      if (resolvedAddress) {
        try {
          const data = await fetchBlockchainData(resolvedAddress);
          setBlockchainData(data);
        } catch (error) {
          console.error('Error fetching blockchain data:', error);
        }
      }
    };
    
    loadBlockchainData();
  }, [resolvedAddress]);

  useEffect(() => {
    const createPassport = async () => {
      if (!resolvedAddress) return;
      
      setLoading(true);
      
      try {
        const skills = [];
        
        if (blockchainProfile) {
          if (parseFloat(blockchainProfile.balance) > 0) skills.push({ name: 'ETH Holder', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 10) skills.push({ name: 'Active Trader', proof: `etherscan://${resolvedAddress}` });
          if (blockchainProfile.transactionCount > 50) skills.push({ name: 'Power User', proof: `etherscan://${resolvedAddress}` });
        }
        
        if (resolvedEns?.includes('.eth')) skills.push({ name: 'ENS Owner', proof: `ens://${resolvedEns}` });
        
        if (transactions && transactions.length > 0) {
          const hasContractInteractions = transactions.some(tx => tx.input && tx.input !== '0x');
          if (hasContractInteractions) skills.push({ name: 'Smart Contract User', proof: `etherscan://${resolvedAddress}` });
          
          const recentTx = transactions.some(tx => {
            const txDate = new Date(parseInt(tx.timeStamp) * 1000);
            const now = new Date();
            const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
            return daysDiff < 30;
          });
          
          if (recentTx) skills.push({ name: 'Recently Active', proof: `etherscan://${resolvedAddress}` });
        }
        
        if (tokenTransfers && tokenTransfers.length > 0) {
          const uniqueTokens = new Set(tokenTransfers.map(tx => tx.tokenSymbol));
          if (uniqueTokens.size > 0) skills.push({ name: 'Token Holder', proof: `etherscan://${resolvedAddress}` });
          if (uniqueTokens.size > 5) skills.push({ name: 'Token Collector', proof: `etherscan://${resolvedAddress}` });
          
          if (Array.from(uniqueTokens).some(token => token === 'UNI')) {
            skills.push({ name: 'Uniswap User', proof: `etherscan://${resolvedAddress}` });
          }
        }
        
        if (web3BioProfile) {
          if (web3BioProfile.github) skills.push({ name: 'GitHub User', proof: web3BioProfile.github });
          if (web3BioProfile.twitter) skills.push({ name: 'Twitter User', proof: web3BioProfile.twitter });
          if (web3BioProfile.linkedin) skills.push({ name: 'LinkedIn User', proof: web3BioProfile.linkedin });
        }
        
        skills.push(
          { name: 'Smart Contract Developer', proof: 'talentprotocol.com/skills/dev' },
          { name: 'EVM Expert', proof: 'talentprotocol.com/skills/evm' },
          { name: 'Solidity', proof: 'talentprotocol.com/skills/solidity' }
        );

        if (blockchainData.boxDomains && blockchainData.boxDomains.length > 0) {
          skills.push({ name: '.box Domain Owner', proof: 'box.domains' });
        }

        if (blockchainData.snsActive) {
          skills.push({ name: 'SNS.ID User', proof: 'sns.id' });
        }
        
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
  }, [resolvedAddress, resolvedEns, blockchainProfile, transactions, tokenTransfers, web3BioProfile, blockchainData]);

  const exportAsPDF = async () => {
    const resumeElement = document.getElementById('resume-pdf');
    if (!resumeElement) return;
    
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we generate your PDF...'
      });
      
      document.body.classList.add('generating-pdf');
      
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });
      
      document.body.classList.remove('generating-pdf');
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const imgWidth = 210;
      const imgHeight = canvas.height * imgWidth / canvas.width;
      
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      pdf.save(`${passport?.passport_id || 'blockchain-profile'}-resume.pdf`);
      
      toast({
        title: 'PDF Generated',
        description: 'Your resume has been successfully downloaded!'
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: 'PDF Generation Failed',
        description: 'There was an error generating your PDF',
        variant: 'destructive'
      });
      document.body.classList.remove('generating-pdf');
    }
  };

  const passportWithScore = passport ? {
    ...passport,
    ...calculateHumanScore(passport),
    hasMoreSkills: passport.skills.length > 4,
    skills: passport.skills || [],
    socials: passport.socials || {
      github: undefined,
      twitter: undefined,
      linkedin: undefined,
      website: undefined,
      email: undefined
    }
  } : null;

  return (
    <div className="container mx-auto py-8 max-w-5xl">
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
          <ProfileHeader passport={passportWithScore} />
          <TooltipProvider>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 md:w-[600px] mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-6">
                <OverviewTab 
                  skills={passportWithScore.skills}
                  name={passportWithScore.name}
                  blockchainProfile={blockchainProfile}
                  transactions={transactions}
                  address={passportWithScore.owner_address}
                />
              </TabsContent>
              
              <TabsContent value="blockchain" className="space-y-6 mt-6">
                <BlockchainTab 
                  transactions={transactions}
                  address={passportWithScore.owner_address}
                />
              </TabsContent>
              
              <TabsContent value="skills" className="space-y-6 mt-6">
                <SkillsTab 
                  skills={passportWithScore.skills}
                  name={passportWithScore.name}
                />
              </TabsContent>
              
              <TabsContent value="resume" className="space-y-6 mt-6">
                <ResumeTab 
                  passport={passportWithScore}
                  blockchainProfile={{
                    ...blockchainProfile,
                    mirrorPosts: blockchainData.mirrorPosts,
                    lensActivity: blockchainData.lensActivity,
                    boxDomains: blockchainData.boxDomains,
                    snsActive: blockchainData.snsActive
                  }}
                  resolvedEns={resolvedEns}
                  onExportPdf={exportAsPDF}
                />
              </TabsContent>
            </Tabs>
          </TooltipProvider>
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

export default TalentProfile;
