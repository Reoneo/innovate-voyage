import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Users, 
  Database,
  ArrowRight,
  Search,
  Shield,
  Mail,
  Linkedin,
  Globe
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

// Image URLs for floating logos - updated Talent Protocol URL
const logoUrls = [
  "https://altcoinsbox.com/wp-content/uploads/2023/04/full-ethereum-name-service-logo.png",
  "https://web3.bio/web3bio-logo.png",
  "https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/7c844b24-d8f5-417f-accb-574c88b75e26/Logo_TalentProtocol.jpg?table=block&id=507f9f8e-04b7-478b-8a33-8900e4838847&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1743948000000&signature=gk2ASkxTsqSqmE_gIMWkAlMMZ3Fdo1YOD9Smt-okG6s&downloadName=Logo_TalentProtocol.jpg",
  "https://etherscan.io/images/brandassets/etherscan-logo.svg"
];

// Floating Logo Component - fixed to ensure consistent speed and spacing
interface FloatingLogoProps {
  imageUrl: string;
  index: number;
  totalLogos: number;
}

const FloatingLogo: React.FC<FloatingLogoProps> = ({ imageUrl, index, totalLogos }) => {
  const speed = 30; // Same speed for all logos
  const verticalSpacing = 100 / (totalLogos + 1); // Evenly space logos vertically
  
  return (
    <div 
      className="absolute" 
      style={{
        animation: `floatRight ${speed}s linear infinite`,
        animationDelay: `${index * (speed / totalLogos)}s`, // Staggered start times
        top: `${verticalSpacing * (index + 1)}%`,
        zIndex: 1
      }}
    >
      <img 
        src={imageUrl} 
        alt="Web3 logo" 
        className="h-12 md:h-16 object-contain opacity-80 hover:opacity-100 transition-opacity"
      />
    </div>
  );
};

const Index = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      return;
    }
    
    // Normalize the input
    let searchValue = searchInput.trim();
    
    // If input looks like a simple name without extension, assume it's an ENS name
    if (!searchValue.includes('.') && !isValidEthereumAddress(searchValue) && /^[a-zA-Z0-9]+$/.test(searchValue)) {
      searchValue = `${searchValue}.eth`;
    }
    
    // Navigate to the profile page
    navigate(`/${searchValue}`);
    toast.success(`Looking up profile for ${searchValue}`);
  };

  // Add keyframes for the floating animation to the document
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes floatRight {
        0% { transform: translateX(100vw); }
        100% { transform: translateX(-20vw); }
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Recruitment.box | Decentralized CV & Recruitment Engine</title>
        <meta name="description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
        <meta name="keywords" content="blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, blockchain verification" />
        <meta property="og:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
        <meta property="og:description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
        <meta property="og:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Recruitment.box | Decentralized CV & Recruitment Engine" />
        <meta name="twitter:description" content="A decentralized CV & recruitment engine powered by blockchain data. Find talent, verify skills, and connect with professionals in Web3." />
        <meta name="twitter:image" content="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" />
        <link rel="canonical" href="https://recruitment.box" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section with Logo */}
        <div className="flex flex-col items-center text-center mb-16">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <a href="https://smith.box" title="Go to smith.box">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg hover:shadow-xl transition-all duration-300">
                  <AvatarImage src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" alt="Recruitment.box Logo" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
              </a>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4">
              Recruitment.box
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-8">
              Find talent on the blockchain with our decentralized CV & recruitment engine
            </p>
            
            {/* Simple Search Form */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Input
                    placeholder="Search by ENS, address or domain"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="pr-10"
                    aria-label="Search profiles"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                    <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                </div>
                <Button type="submit">Search</Button>
              </form>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button size="lg" variant="outline" disabled title="Coming soon">
              <span className="flex items-center">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </span>
            </Button>
          </div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16">
          <div className="text-center mb-16 relative overflow-hidden">
            <h2 className="text-3xl font-bold mb-4">Powered by</h2>
            
            {/* Floating Web3 Logos - updated to ensure even spacing */}
            <div className="h-60 w-full relative mb-6">
              {logoUrls.map((url, index) => (
                <FloatingLogo 
                  key={index} 
                  imageUrl={url} 
                  index={index} 
                  totalLogos={logoUrls.length}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="glass-card">
              <CardHeader>
                <Shield className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                <CardTitle>Decentralized Identity</CardTitle>
                <CardDescription>
                  Verify your skills and experience through blockchain credentials
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Use your ENS domain and on-chain data to create a verified, 
                  tamper-proof professional profile.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Database className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                <CardTitle>On-Chain Verification</CardTitle>
                <CardDescription>
                  Your contributions and achievements are cryptographically verified
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Smart contract history, DAO participation, and verified Git commits
                  provide objective proof of your skills.
                </p>
              </CardContent>
            </Card>

            <Card className="glass-card">
              <CardHeader>
                <Search className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
                <CardTitle>AI-Powered Matching</CardTitle>
                <CardDescription>
                  Intelligent algorithms find the perfect job match
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  Our Web3-native matching algorithm analyzes your on-chain activity
                  to recommend the most suitable opportunities.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Roadmap Section - Replacing the CTA Section */}
        <div className="py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Product Roadmap</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
              <div className="border border-muted rounded-lg p-6 bg-card">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">1</span>
                  <h3 className="text-xl font-semibold">Auto-Generated CVs</h3>
                </div>
                <p className="text-muted-foreground pl-10">
                  Automatically generate comprehensive professional profiles from verified blockchain records and on-chain activity.
                  <span className="inline-flex items-center ml-2 text-xs font-medium text-primary">In Development</span>
                </p>
              </div>
              
              <div className="border border-muted rounded-lg p-6 bg-card">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">2</span>
                  <h3 className="text-xl font-semibold">Blockchain ID Integration</h3>
                </div>
                <p className="text-muted-foreground pl-10">
                  Comprehensive integration with all major blockchain identity services for a unified professional presence across Web3.
                </p>
              </div>
              
              <div className="border border-muted rounded-lg p-6 bg-card">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">3</span>
                  <h3 className="text-xl font-semibold">AI Candidate-Job Matching</h3>
                </div>
                <p className="text-muted-foreground pl-10">
                  Advanced AI algorithms to match candidates with optimal job opportunities based on verified skills and experience.
                </p>
              </div>
              
              <div className="border border-muted rounded-lg p-6 bg-card">
                <div className="flex items-center mb-3">
                  <span className="bg-primary/10 text-primary font-medium rounded-full h-7 w-7 flex items-center justify-center mr-3">4</span>
                  <h3 className="text-xl font-semibold">Future Developments</h3>
                </div>
                <p className="text-muted-foreground pl-10">
                  Additional features and platform enhancements to be announced based on community feedback and evolving industry needs.
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer with social links */}
        <footer className="py-8 border-t border-gray-200 mt-8">
          <div className="flex justify-center space-x-6">
            <a href="mailto:hello@smith.box" aria-label="Email" className="text-gray-600 hover:text-primary">
              <Mail className="h-6 w-6" />
            </a>
            <a href="https://www.linkedin.com/company/thridweb" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-600 hover:text-primary">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="https://www.smith.box" target="_blank" rel="noopener noreferrer" aria-label="Website" className="text-gray-600 hover:text-primary">
              <Globe className="h-6 w-6" />
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Index;
