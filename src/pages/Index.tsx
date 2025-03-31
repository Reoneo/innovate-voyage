
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import TalentSearch from '@/components/talent/TalentSearch';
import TalentGrid from '@/components/talent/TalentGrid';
import { BlockchainPassport } from '@/lib/utils';
import { useEnsByAddress, useAddressByEns } from '@/hooks/useWeb3';

const Index = () => {
  const navigate = useNavigate();
  
  // Add states for talent search
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlockchainPassport[]>([]);

  // Add resolver hooks from talent.tsx
  const { data: ensDataByAddress } = useEnsByAddress(addressSearch);
  const { data: addressDataByEns } = useAddressByEns(
    addressSearch.includes('.eth') || addressSearch.includes('.box') ? addressSearch : undefined
  );
  
  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  // Handle address search from talent page
  const handleAddressSearch = (input: string) => {
    setAddressSearch(input);
    
    // If valid input, start searching
    if (input) {
      setIsSearching(true);
      
      // Process search after a slight delay to show loading state
      setTimeout(() => {
        let address = input;
        let ensName = '';
        let avatar = '/placeholder.svg';
        
        try {
          // If ENS name is provided, try to resolve address
          if (input.includes('.eth') || input.includes('.box')) {
            if (addressDataByEns) {
              address = addressDataByEns.address;
              ensName = addressDataByEns.ensName;
              avatar = addressDataByEns.avatar || '/placeholder.svg';
            } else {
              // No data found, show empty results
              setIsSearching(false);
              setSearchResults([]);
              return;
            }
          } 
          // If address is provided, try to resolve ENS name
          else if (ensDataByAddress) {
            ensName = ensDataByAddress.ensName;
            avatar = ensDataByAddress.avatar || '/placeholder.svg';
          }
          
          // If no ENS name, use a truncated address
          if (!ensName) {
            ensName = address.substring(0, 6) + '...' + address.substring(address.length - 4);
          }
          
          // Create new passport from search data
          const newPassport: BlockchainPassport = {
            passport_id: ensName,
            owner_address: address,
            avatar_url: avatar,
            name: ensName.split('.')[0],
            issued: new Date().toISOString(),
            skills: [], // Adding the required skills property
            socials: {}
          };
          
          setSearchResults([newPassport]);
        } catch (error) {
          console.error('Error fetching data:', error);
          setSearchResults([]);
        } finally {
          setIsSearching(false);
        }
      }, 500);
    }
  };

  // Process passport data for display
  const passportData = React.useMemo(() => {
    if (searchResults.length > 0) {
      return searchResults.map(passport => {
        return {
          ...passport,
          score: 0,
          category: "",
          colorClass: "",
          hasMoreSkills: false
        };
      });
    }
    return [];
  }, [searchResults]);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 sm:px-6 py-8">
        {/* Hero Section with Logo */}
        <div className="flex flex-col items-center text-center mb-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-6"
          >
            <div className="flex justify-center mb-6">
              <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                <AvatarImage src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" alt="Profile Logo" />
                <AvatarFallback>RB</AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-gradient mb-4">
              Recruitment.box
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-6">
              A decentralized CV & recruitment engine powered by blockchain data
            </p>
          </motion.div>

          {/* Add Talent Search Section */}
          <div className="w-full max-w-4xl mx-auto mt-4 mb-8">
            <TalentSearch 
              onSearch={handleAddressSearch}
              isSearching={isSearching}
            />
          </div>

          {/* Display Search Results */}
          {addressSearch && (
            <div className="w-full max-w-4xl mx-auto">
              <TalentGrid
                isLoading={isSearching}
                passportData={passportData}
                clearFilters={() => {}}
              />
            </div>
          )}

          {!addressSearch && (
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 mt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <Button size="lg" variant="outline" disabled title="Coming soon">
                <span className="flex items-center">
                  Browse Jobs
                  <ArrowRight className="ml-2 h-4 w-4" />
                </span>
              </Button>
            </motion.div>
          )}
        </div>

        {/* Only show features section if no search is active */}
        {!addressSearch && (
          <>
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
                    <Shield className="h-12 w-12 text-primary mb-4" />
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
                    <Database className="h-12 w-12 text-primary mb-4" />
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
                    <Search className="h-12 w-12 text-primary mb-4" />
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
          </>
        )}
      </div>
    </div>
  );
};

export default Index;
