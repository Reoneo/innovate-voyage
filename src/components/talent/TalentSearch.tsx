
import React, { useState, useEffect } from 'react';
import { SearchIcon, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEnsResolver } from '@/hooks/useEnsResolver';

interface TalentSearchProps {
  onSearch: (query: string) => void;
  onViewAll: () => void;
  isSearching: boolean;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, onViewAll, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{name: string, address?: string, avatar?: string}>>([]);
  
  // ENS resolver for the current search input
  const { resolvedAddress, resolvedEns, avatarUrl, isLoading } = useEnsResolver(
    searchInput.includes('.eth') || searchInput.includes('.box') ? searchInput : undefined,
    isValidEthereumAddress(searchInput) ? searchInput : undefined
  );
  
  // Update search results when ENS is resolved
  useEffect(() => {
    if (resolvedEns || resolvedAddress) {
      setSearchResults([{
        name: resolvedEns || searchInput,
        address: resolvedAddress,
        avatar: avatarUrl
      }]);
    } else {
      setSearchResults([]);
    }
  }, [resolvedEns, resolvedAddress, avatarUrl, searchInput]);
  
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    // Validate input before searching
    const isValidInput = searchInput.includes('.eth') || searchInput.includes('.box') || isValidEthereumAddress(searchInput);
    
    if (!isValidInput) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid ENS name (.eth or .box) or Ethereum address",
        variant: "destructive"
      });
      return;
    }
    
    onSearch(searchInput.trim());
  };

  const handleResultClick = (result: {name: string, address?: string}) => {
    setSearchInput(result.name);
    handleSearch();
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Find Web3 Talent</h2>
              <p className="text-sm text-muted-foreground">
                Search by ENS name (.eth or .box) or Ethereum wallet address
              </p>
            </div>
            <div className="relative mt-2">
              <Input
                placeholder="vitalik.eth, recruitment.box or 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <SearchIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-1 text-xs text-muted-foreground">
              {searchInput && (
                <>
                  {searchInput.includes('.eth') ? 
                    'Searching for ENS name on Ethereum Mainnet' : 
                    searchInput.includes('.box') ?
                      'Searching for .box domain on Optimistic Etherscan' :
                      isValidEthereumAddress(searchInput) ? 
                        'Valid Ethereum address' : 
                        'Enter a valid ENS name (.eth or .box) or Ethereum address'}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchInput.trim() || 
                (!searchInput.includes('.eth') && !searchInput.includes('.box') && 
                 !isValidEthereumAddress(searchInput))}
              className="w-full"
            >
              {isSearching ? 'Searching...' : 'Search'}
            </Button>
            <Button 
              variant="outline" 
              onClick={onViewAll}
              className="w-full"
            >
              <Users className="h-4 w-4 mr-2" />
              View All
            </Button>
          </div>
        </div>
        
        {/* Inline search results */}
        {searchInput && searchResults.length > 0 && (
          <div className="mt-4 border rounded-md overflow-hidden">
            <div className="p-3 bg-muted font-medium">
              Search Results
            </div>
            <div className="divide-y">
              {searchResults.map((result, index) => (
                <div 
                  key={index} 
                  className="p-3 hover:bg-muted/50 cursor-pointer flex items-center gap-3"
                  onClick={() => handleResultClick(result)}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={result.avatar || '/placeholder.svg'} alt={result.name} />
                    <AvatarFallback>{result.name.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{result.name}</div>
                    {result.address && (
                      <div className="text-xs text-muted-foreground">
                        {result.address.substring(0, 6)}...{result.address.substring(result.address.length - 4)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {searchInput && isLoading && (
          <div className="mt-4 p-3 text-center text-muted-foreground">
            {searchInput.includes('.box') ? 'Searching on Optimism network...' : 'Searching...'}
          </div>
        )}
        
        {searchInput && !isLoading && searchResults.length === 0 && (
          <div className="mt-4 p-3 text-center text-muted-foreground">
            No results found. Try a different search term.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
