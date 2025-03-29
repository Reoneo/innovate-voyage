
import React, { useState } from 'react';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Alert } from '@/components/ui/alert';

interface TalentSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{name: string, address?: string, avatar?: string}>>([]);
  const [hasExecutedSearch, setHasExecutedSearch] = useState(false);
  
  // Initialize resolver but don't trigger it automatically
  const { resolvedAddress, resolvedEns, avatarUrl, isLoading, error } = useEnsResolver(
    hasExecutedSearch && searchInput.includes('.eth') ? searchInput : undefined,
    hasExecutedSearch && isValidEthereumAddress(searchInput) ? searchInput : undefined
  );
  
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
    
    // Set flag to execute the search
    setHasExecutedSearch(true);
    
    // Update results only when search is executed
    if (resolvedEns || resolvedAddress) {
      setSearchResults([{
        name: resolvedEns || searchInput,
        address: resolvedAddress,
        avatar: avatarUrl
      }]);
    } else {
      // Clear results if nothing found
      setSearchResults([]);
    }
    
    onSearch(searchInput.trim());
  };

  const handleResultClick = (result: {name: string, address?: string}) => {
    setSearchInput(result.name);
    onSearch(result.name);
  };
  
  return (
    <Card className="mb-6">
      <CardContent className="pt-6">
        <div className="space-y-4 max-w-4xl mx-auto">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Web3 Talent Network</h2>
            <p className="text-muted-foreground">
              Search by ENS name (.eth or .box) or Ethereum wallet address
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder="vitalik.eth, recruitment.box or 0x71C7..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <SearchIcon className="h-4 w-4 text-muted-foreground" />
              </div>
            </div>
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || isLoading || !searchInput.trim() || 
                (!searchInput.includes('.eth') && !searchInput.includes('.box') && 
                 !isValidEthereumAddress(searchInput))}
            >
              {isSearching || isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            {searchInput && (
              <>
                {searchInput.includes('.eth') ? 
                  'Searching for ENS name on Ethereum Mainnet' : 
                  searchInput.includes('.box') ?
                    'Searching for .box domain on Optimism network' :
                    isValidEthereumAddress(searchInput) ? 
                      'Valid Ethereum address' : 
                      'Enter a valid ENS name (.eth or .box) or Ethereum address'}
              </>
            )}
          </div>
        </div>
        
        {/* Search results section - only show if search was executed */}
        {hasExecutedSearch && searchInput && (
          <div className="mt-6">
            {/* Loading state */}
            {isLoading && (
              <div className="p-4 text-center">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                <p className="mt-2 text-muted-foreground">
                  {searchInput.includes('.box') ? 'Searching on Optimism network...' : 'Searching...'}
                </p>
              </div>
            )}
            
            {/* Results found */}
            {!isLoading && searchResults.length > 0 && !isSearching && (
              <div className="rounded-lg overflow-hidden bg-accent/50 backdrop-blur-sm">
                <div className="p-3 bg-muted/70 font-medium border-b flex justify-between items-center">
                  <span>Search Results</span>
                  <span className="text-xs text-muted-foreground">{searchResults.length} found</span>
                </div>
                <div>
                  {searchResults.map((result, index) => (
                    <div 
                      key={index} 
                      className="p-4 hover:bg-muted/30 cursor-pointer flex items-center gap-4 transition-colors"
                      onClick={() => handleResultClick(result)}
                    >
                      <Avatar className="h-12 w-12 ring-2 ring-background/50">
                        <AvatarImage src={result.avatar || '/placeholder.svg'} alt={result.name} />
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {result.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium text-lg">{result.name}</div>
                        {result.address && (
                          <div className="text-sm text-muted-foreground font-mono">
                            {result.address.substring(0, 8)}...{result.address.substring(result.address.length - 6)}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* No results state - removed as requested */}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
