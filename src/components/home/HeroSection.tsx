
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { Card } from '@/components/ui/card';

// Platform icon URLs
const PLATFORM_ICONS = {
  ens: "https://toppng.com/uploads/preview/ens-logo-ethereum-name-service-11563224806hmo41gaxv3.png",
  farcaster: "https://docs.farcaster.xyz/icon.png",
  lens: "https://img.cryptorank.io/coins/lens_protocol1733845125692.png",
  base: "https://basetradingbots.com/wp-content/uploads/2024/04/base.png"
};

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  
  // Handle click outside to close search results
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Search for identities when input changes
  useEffect(() => {
    const searchTimer = setTimeout(async () => {
      if (searchInput && searchInput.length >= 3) {
        setIsLoading(true);
        try {
          // Simulate search results for common web3 identity types
          const results = [];
          
          // Include ENS result
          results.push({
            id: `${searchInput}.eth`,
            type: 'ens',
            icon: PLATFORM_ICONS.ens,
            name: `${searchInput}.eth`
          });
          
          // Include regular name (now Farcaster)
          results.push({
            id: searchInput,
            type: 'farcaster',
            icon: PLATFORM_ICONS.farcaster,
            name: searchInput
          });
          
          // Include Lens result
          results.push({
            id: `${searchInput}.lens`,
            type: 'lens',
            icon: PLATFORM_ICONS.lens,
            name: `${searchInput}.lens`
          });
          
          // Include Base result
          results.push({
            id: `${searchInput}.base.eth`,
            type: 'base',
            icon: PLATFORM_ICONS.base,
            name: `${searchInput}.base.eth`
          });
          
          // Include .box domain
          results.push({
            id: `${searchInput}.box`,
            type: 'box',
            icon: "https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png",
            name: `${searchInput}.box`
          });
          
          setSearchResults(results);
          setShowResults(true);
        } catch (error) {
          console.error('Search error:', error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);
    
    return () => clearTimeout(searchTimer);
  }, [searchInput]);
  
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
    setShowResults(false);
  };
  
  const handleResultClick = (identity: string) => {
    navigate(`/${identity}`);
    toast.success(`Looking up profile for ${identity}`);
    setShowResults(false);
    setSearchInput('');
  };
  
  // Get icon for identity type - now using image components instead of text
  const getIdentityIcon = (type: string) => {
    switch (type) {
      case 'ens':
        return <img src={PLATFORM_ICONS.ens} alt="ENS" className="w-6 h-6 object-contain" />;
      case 'farcaster':
        return <img src={PLATFORM_ICONS.farcaster} alt="Farcaster" className="w-6 h-6 object-contain" />;
      case 'lens':
        return <img src={PLATFORM_ICONS.lens} alt="Lens" className="w-6 h-6 object-contain" />;
      case 'base':
        return <img src={PLATFORM_ICONS.base} alt="Base" className="w-6 h-6 object-contain" />;
      case 'box':
        return <img src="https://pbs.twimg.com/profile_images/1673978200800473088/96dq4nBA_400x400.png" alt="Box" className="w-6 h-6 object-contain" />;
      default:
        return <span className="text-xl">●</span>;
    }
  };

  return (
    <div className="flex flex-col items-center text-center mb-16">
      <div className="mb-8">
        <div className="flex justify-center mb-6">
          <a href="https://smith.box" title="Go to smith.box">
            <Avatar className="h-32 w-32 border-4 border-primary shadow-lg hover:shadow-xl transition-all duration-300">
              <AvatarImage 
                src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" 
                alt="Recruitment.box Logo" 
                loading="eager"
                fetchPriority="high"
              />
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
        
        {/* Enhanced Search Form with Dropdown Results */}
        <div className="max-w-md mx-auto mb-8 relative" ref={searchRef}>
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Search by ENS, address or domain"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10 bg-background text-foreground"
                aria-label="Search profiles"
                autoComplete="off"
                onFocus={() => {
                  if (searchInput.length >= 3) {
                    setShowResults(true);
                  }
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <Search className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              </div>
            </div>
            <Button type="submit">Search</Button>
          </form>
          
          {/* Search Results Dropdown */}
          {showResults && searchResults.length > 0 && (
            <Card className="absolute top-full left-0 right-0 z-50 mt-1 max-h-60 overflow-auto border shadow-lg bg-background">
              <ul className="py-1">
                {searchResults.map((result) => (
                  <li key={result.id}>
                    <button
                      className="w-full text-left px-4 py-2 hover:bg-accent flex items-center gap-3"
                      onClick={() => handleResultClick(result.id)}
                    >
                      <div className="flex items-center justify-center w-8 h-8">
                        {getIdentityIcon(result.type)}
                      </div>
                      <span>{result.name}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          )}
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
  );
};

export default HeroSection;
