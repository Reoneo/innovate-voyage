
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  
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
    
    // Only proceed if we have an ENS name (.eth or .box) or valid Ethereum address
    const validInput = searchValue.endsWith('.eth') || 
                       searchValue.endsWith('.box') || 
                       isValidEthereumAddress(searchValue);
                       
    if (validInput) {
      // Navigate to the profile page
      navigate(`/${searchValue}`);
      toast.success(`Looking up profile for ${searchValue}`);
    } else {
      toast.error('Please enter a valid ENS name (.eth or .box) or Ethereum address');
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
        
        {/* Simplified Search Form without Live Suggestions */}
        <div className="max-w-md mx-auto mb-8">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder="Search by ENS (.eth, .box) or address"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10 bg-background text-foreground"
                aria-label="Search profiles"
                autoComplete="off"
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
  );
};

export default HeroSection;
