
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Database,
  ArrowRight,
  Search,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { Helmet } from 'react-helmet-async';

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
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
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
              A decentralized CV & recruitment engine powered by blockchain data
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
          </motion.div>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <Button size="lg" variant="outline" disabled title="Coming soon">
              <span className="flex items-center">
                Browse Jobs
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </span>
            </Button>
          </motion.div>
        </div>

        {/* Features Section */}
        <div id="features" className="py-16">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Why Recruitment.box?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our platform leverages Web3 technology to create a transparent, 
              efficient, and reliable recruitment experience.
            </p>
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

        {/* CTA Section */}
        <div className="py-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Ready to transform your recruitment experience?</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join the future of decentralized recruitment where your blockchain identity
              becomes your verified career passport.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
