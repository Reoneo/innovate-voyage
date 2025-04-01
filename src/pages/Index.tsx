
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, 
  Users, 
  Database,
  ArrowRight,
  Search,
  Shield,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Command,
  CommandList,
  CommandGroup,
  CommandItem,
  CommandInput,
  CommandEmpty
} from '@/components/ui/command';
import { fetchWeb3BioProfile } from '@/api/utils/web3';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

// Define a search result interface
interface SearchResult {
  identity: string;
  displayName?: string;
  avatar?: string | null;
  address?: string;
  platform?: string;
}

const Index = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  
  const handleNavigation = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    navigate(path);
  };

  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }
    
    setIsSearching(true);
    
    try {
      // Fetch the profile using web3.bio
      const profile = await fetchWeb3BioProfile(query);
      
      if (profile) {
        const results: SearchResult[] = [
          {
            identity: profile.identity || query,
            displayName: profile.displayName || profile.identity || query,
            avatar: profile.avatar,
            address: profile.address,
            platform: profile.platform
          }
        ];
        
        // If we have aliases, add them as additional results
        if (profile.aliases && Array.isArray(profile.aliases)) {
          profile.aliases.forEach((alias: any) => {
            if (typeof alias === 'string' && alias.includes('.')) {
              results.push({
                identity: alias,
                displayName: alias,
                avatar: profile.avatar,
                address: profile.address
              });
            }
          });
        }
        
        setSearchResults(results);
      } else {
        // If input looks like an address or ENS name, provide a direct link option
        if (isValidEthereumAddress(query) || query.includes('.')) {
          setSearchResults([{
            identity: query,
            displayName: query
          }]);
        } else {
          setSearchResults([]);
        }
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    // Debounce search to avoid too many API calls
    const timer = setTimeout(() => {
      if (searchInput.trim()) {
        performSearch(searchInput);
      }
    }, 400);
    
    return () => clearTimeout(timer);
  }, [searchInput]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchInput.trim()) {
      return;
    }
    
    // If there's only one result, navigate directly
    if (searchResults.length === 1) {
      navigateToProfile(searchResults[0].identity);
    } else {
      // Normalize the input
      let searchValue = searchInput.trim();
      
      // If input looks like a simple name without extension, assume it's an ENS name
      if (!searchValue.includes('.') && !isValidEthereumAddress(searchValue) && /^[a-zA-Z0-9]+$/.test(searchValue)) {
        searchValue = `${searchValue}.eth`;
      }
      
      navigateToProfile(searchValue);
    }
  };

  const navigateToProfile = (identity: string) => {
    // Navigate to the profile page
    setIsPopoverOpen(false);
    navigate(`/${identity}`);
    toast.success(`Looking up profile for ${identity}`);
  };

  return (
    <div className="min-h-screen bg-background">
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
              <a href="https://smith.box" className="block">
                <Avatar className="h-32 w-32 border-4 border-primary shadow-lg">
                  <AvatarImage src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" alt="Profile Logo" />
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
            
            {/* Search Form with Dropdown */}
            <div className="max-w-md mx-auto mb-8">
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-grow">
                  <Popover open={isPopoverOpen && searchInput.length > 0} onOpenChange={setIsPopoverOpen}>
                    <PopoverTrigger asChild>
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                        <Input
                          placeholder="Search by ENS, address or domain"
                          value={searchInput}
                          onChange={(e) => {
                            setSearchInput(e.target.value);
                            setIsPopoverOpen(e.target.value.length > 0);
                          }}
                          className="pl-9"
                          onFocus={() => searchInput && setIsPopoverOpen(true)}
                        />
                        {isSearching && (
                          <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4 animate-spin" />
                        )}
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="p-0 w-[300px] max-h-[300px] overflow-auto" align="start">
                      <Command>
                        <CommandInput placeholder="Search web3 identities..." value={searchInput} 
                          onValueChange={(value) => setSearchInput(value)} 
                        />
                        <CommandList>
                          {isSearching ? (
                            <div className="flex items-center justify-center p-4">
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                              <span>Searching...</span>
                            </div>
                          ) : (
                            <>
                              <CommandEmpty>No results found</CommandEmpty>
                              {searchResults.length > 0 && (
                                <CommandGroup heading="Results">
                                  {searchResults.map((result, index) => (
                                    <CommandItem
                                      key={index}
                                      onSelect={() => navigateToProfile(result.identity)}
                                      className="flex items-center gap-2 cursor-pointer"
                                    >
                                      <Avatar className="h-6 w-6">
                                        {result.avatar ? (
                                          <AvatarImage src={result.avatar} alt={result.displayName} />
                                        ) : (
                                          <AvatarFallback>{result.displayName?.[0] || '?'}</AvatarFallback>
                                        )}
                                      </Avatar>
                                      <div className="flex flex-col">
                                        <span className="font-medium">{result.displayName}</span>
                                        {result.address && (
                                          <span className="text-xs text-muted-foreground truncate">
                                            {result.address.substring(0, 6)}...{result.address.substring(result.address.length - 4)}
                                          </span>
                                        )}
                                      </div>
                                      {result.platform && (
                                        <span className="ml-auto text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                                          {result.platform}
                                        </span>
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              )}
                            </>
                          )}
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                <ArrowRight className="ml-2 h-4 w-4" />
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
      </div>
    </div>
  );
};

export default Index;
