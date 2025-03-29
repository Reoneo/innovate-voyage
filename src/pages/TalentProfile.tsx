
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

// Import components
import ProfileHeader from '@/components/talent/profile/ProfileHeader';
import OverviewTab from '@/components/talent/profile/tabs/OverviewTab';
import BlockchainTab from '@/components/talent/profile/tabs/BlockchainTab';
import SkillsTab from '@/components/talent/profile/tabs/SkillsTab';
import ResumeTab from '@/components/talent/profile/tabs/ResumeTab';
import ProfileSkeleton from '@/components/talent/profile/ProfileSkeleton';
import PDFExport from '@/components/talent/profile/PDFExport';
import { TalentProfileData, PassportSkill } from '@/api/types/web3Types';

const TalentProfile = () => {
  const { ensName, address } = useParams<{ ensName: string; address: string }>();
  const [passport, setPassport] = useState<BlockchainPassport | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPdfPreview, setShowPdfPreview] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const pdfContentRef = useRef<HTMLDivElement>(null);
  
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
        const skills = [] as PassportSkill[];
        
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
    try {
      toast({
        title: 'Generating PDF',
        description: 'Please wait while we generate your PDF...'
      });
      
      // Show PDF preview first
      setShowPdfPreview(true);
      
      // Wait for the PDF content to render
      setTimeout(async () => {
        if (!pdfContentRef.current) {
          toast({
            title: 'PDF Generation Failed',
            description: 'Could not find PDF content element',
            variant: 'destructive'
          });
          return;
        }
        
        const canvas = await html2canvas(pdfContentRef.current, {
          scale: 2,
          useCORS: true,
          logging: false,
          backgroundColor: '#ffffff',
        });
        
        const imgData = canvas.toDataURL('image/png');
        
        // Use A4 size with proper margins (2.54cm ~ 1 inch ~ 72 points)
        const pdf = new jsPDF({
          orientation: 'portrait',
          unit: 'pt',
          format: 'a4'
        });
        
        // A4 size is 595 × 842 points
        const pageWidth = 595;
        const pageHeight = 842;
        
        // Convert margin from cm to points (1cm = 28.35 points)
        const margin = 72; // 2.54cm ~ 72 points
        
        const contentWidth = pageWidth - (margin * 2);
        const contentHeight = pageHeight - (margin * 2);
        
        // Scale image to fit within the margins
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        let scaleFactor = Math.min(
          contentWidth / imgWidth,
          contentHeight / imgHeight
        );
        
        const scaledWidth = imgWidth * scaleFactor;
        const scaledHeight = imgHeight * scaleFactor;
        
        // Center the image on the page
        const x = margin + (contentWidth - scaledWidth) / 2;
        const y = margin + (contentHeight - scaledHeight) / 2;
        
        pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight);
        pdf.save(`${passport?.passport_id || 'blockchain-profile'}.pdf`);
        
        // Hide PDF preview after generation
        setShowPdfPreview(false);
        
        toast({
          title: 'PDF Generated',
          description: 'Your PDF has been successfully generated!'
        });
      }, 500);
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      setShowPdfPreview(false);
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

  // Prepare data for PDF export
  const pdfData: TalentProfileData | null = passportWithScore ? {
    passport_id: passportWithScore.passport_id,
    owner_address: passportWithScore.owner_address,
    avatar_url: passportWithScore.avatar_url,
    name: passportWithScore.name,
    issued: passportWithScore.issued,
    score: passportWithScore.score,
    category: passportWithScore.category,
    socials: passportWithScore.socials,
    skills: passportWithScore.skills || [],
    blockchainProfile: blockchainProfile,
    resolvedEns: resolvedEns
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
          {/* Profile Header */}
          <ProfileHeader passport={passportWithScore} />
          
          {/* Tabs for different sections */}
          <TooltipProvider>
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid grid-cols-4 md:w-[600px] mx-auto">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="blockchain">Blockchain</TabsTrigger>
                <TabsTrigger value="skills">Skills</TabsTrigger>
                <TabsTrigger value="resume">Resume</TabsTrigger>
              </TabsList>
              
              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6 mt-6">
                <OverviewTab 
                  skills={passportWithScore.skills}
                  name={passportWithScore.name}
                  blockchainProfile={blockchainProfile}
                  transactions={transactions}
                  address={passportWithScore.owner_address}
                />
              </TabsContent>
              
              {/* Blockchain Tab */}
              <TabsContent value="blockchain" className="space-y-6 mt-6">
                <BlockchainTab 
                  transactions={transactions}
                  address={passportWithScore.owner_address}
                />
              </TabsContent>
              
              {/* Skills Tab */}
              <TabsContent value="skills" className="space-y-6 mt-6">
                <SkillsTab 
                  skills={passportWithScore.skills}
                  name={passportWithScore.name}
                />
              </TabsContent>
              
              {/* Resume Tab */}
              <TabsContent value="resume" className="space-y-6 mt-6">
                <ResumeTab 
                  passport={{
                    passport_id: passportWithScore.passport_id,
                    owner_address: passportWithScore.owner_address,
                    skills: passportWithScore.skills,
                    score: passportWithScore.score,
                    category: passportWithScore.category,
                    socials: passportWithScore.socials
                  }}
                  blockchainProfile={blockchainProfile}
                  resolvedEns={resolvedEns}
                  onExportPdf={exportAsPDF}
                />
              </TabsContent>
            </Tabs>
          </TooltipProvider>

          {/* Hidden PDF content for export */}
          {showPdfPreview && pdfData && (
            <div className="fixed top-0 left-0 w-0 h-0 overflow-hidden">
              <div ref={pdfContentRef} style={{ width: '1240px' }}>
                <PDFExport data={pdfData} />
              </div>
            </div>
          )}
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
