
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Database,
  ArrowRight,
  Search,
  Shield,
  Hexagon,
  GitBranch,
  Atom,
  Zap
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
  const [hoveredRoadmapItem, setHoveredRoadmapItem] = useState<number | null>(null);
  
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

  // Roadmap data with futuristic blockchain descriptions
  const roadmapItems = [
    {
      number: 1,
      title: "Auto-Generated CVs",
      description: "Automatically generate comprehensive professional profiles from verified blockchain records and on-chain activity.",
      icon: <Database className="h-6 w-6" />,
      status: "In Development",
      color: "from-indigo-500 to-purple-600"
    },
    {
      number: 2,
      title: "Blockchain ID Integration",
      description: "Comprehensive integration with all major blockchain identity services for a unified professional presence across Web3.",
      icon: <Hexagon className="h-6 w-6" />,
      color: "from-blue-500 to-indigo-600"
    },
    {
      number: 3,
      title: "AI Candidate-Job Matching",
      description: "Advanced AI algorithms to match candidates with optimal job opportunities based on verified skills and experience.",
      icon: <Atom className="h-6 w-6" />,
      color: "from-violet-500 to-purple-600"
    },
    {
      number: 4,
      title: "Future Developments",
      description: "Additional features and platform enhancements to be announced based on community feedback and evolving industry needs.",
      icon: <Zap className="h-6 w-6" />,
      color: "from-fuchsia-500 to-pink-600"
    }
  ];

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

        {/* Interactive Roadmap Section */}
        <div className="py-16 text-center relative">
          {/* Animated blockchain connection lines */}
          <motion.div 
            className="absolute inset-0 z-0 opacity-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.1 }}
            transition={{ duration: 1 }}
          >
            <svg width="100%" height="100%" className="absolute inset-0">
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="currentColor" strokeWidth="1"/>
              </pattern>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Animated connection lines */}
              <motion.path 
                d="M100,200 C150,150 200,250 300,200 C400,150 450,250 500,200" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                initial={{ pathLength: 0, opacity: 0 }} 
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 3, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }}
              />
              <motion.path 
                d="M200,100 C300,150 400,50 500,100 C600,150 700,50 800,100" 
                stroke="currentColor" 
                strokeWidth="3" 
                fill="none" 
                initial={{ pathLength: 0, opacity: 0 }} 
                animate={{ pathLength: 1, opacity: 0.4 }}
                transition={{ duration: 4, ease: "easeInOut", repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
              />
            </svg>
          </motion.div>
          
          <div className="max-w-4xl mx-auto z-10 relative">
            <motion.h2 
              className="text-3xl font-bold mb-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              Product Roadmap
            </motion.h2>
            
            <div className="relative">
              {/* Connecting Line */}
              <div className="absolute left-1/2 top-0 w-1 bg-gradient-to-b from-primary/50 to-primary/10 h-full -translate-x-1/2 rounded-full z-0"></div>
              
              {/* Roadmap Items */}
              <div className="relative z-10 space-y-16">
                {roadmapItems.map((item, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.2, duration: 0.6 }}
                    onMouseEnter={() => setHoveredRoadmapItem(index)}
                    onMouseLeave={() => setHoveredRoadmapItem(null)}
                    className="relative"
                  >
                    {/* Timeline Node */}
                    <motion.div 
                      className={`absolute left-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-gradient-to-r ${item.color} flex items-center justify-center text-white shadow-lg z-10`}
                      animate={{ 
                        scale: hoveredRoadmapItem === index ? 1.1 : 1,
                        boxShadow: hoveredRoadmapItem === index ? '0 0 20px rgba(139, 92, 246, 0.6)' : '0 0 0px rgba(139, 92, 246, 0)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      {item.icon}
                    </motion.div>
                    
                    {/* Content Card */}
                    <motion.div 
                      className={`ml-[calc(50%+2rem)] mr-4 md:ml-[calc(50%+3rem)] md:mr-0 md:w-[calc(50%-4rem)] bg-card border border-border rounded-lg shadow-lg p-6 ${(index % 2 !== 0) ? 'md:ml-4 md:mr-[calc(50%+3rem)] md:translate-x-[-100%]' : ''}`}
                      animate={{ 
                        y: hoveredRoadmapItem === index ? -5 : 0,
                        boxShadow: hoveredRoadmapItem === index ? '0 10px 25px -5px rgba(0, 0, 0, 0.1)' : '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                      }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2">
                          <h3 className="text-xl font-semibold">{item.title}</h3>
                          {item.status && (
                            <span className="text-xs font-medium text-primary bg-primary/10 px-2 py-1 rounded-full">
                              {item.status}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                      
                      {/* Decorative Hexagon Pattern */}
                      <div className="absolute top-2 right-2 opacity-10">
                        <GitBranch className="w-24 h-24" />
                      </div>
                    </motion.div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
