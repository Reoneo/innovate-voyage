
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';
import { useEnsResolver } from '@/hooks/useEnsResolver';

interface TalentSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [hasExecutedSearch, setHasExecutedSearch] = useState(false);
  const [shouldResolve, setShouldResolve] = useState(false);
  
  // Initialize resolver but don't trigger it automatically
  const { resolvedAddress, resolvedEns, isLoading } = useEnsResolver(
    shouldResolve && (searchInput.includes('.eth') || searchInput.includes('.box')) ? searchInput : undefined,
    shouldResolve && isValidEthereumAddress(searchInput) ? searchInput : undefined
  );
  
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    // Validate input before searching
    const isValidInput = searchInput.includes('.eth') || searchInput.includes('.box') || isValidEthereumAddress(searchInput);
    
    if (!isValidInput) {
      return;
    }
    
    // Set flag to execute the search
    setHasExecutedSearch(true);
    setShouldResolve(true);
    
    // Pass the input to the parent component for searching
    onSearch(searchInput.trim());
  };

  // Effect to reset shouldResolve after resolution completes
  useEffect(() => {
    if (!isLoading && shouldResolve) {
      setShouldResolve(false);
    }
  }, [isLoading, resolvedAddress, resolvedEns]);

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
                placeholder="vitalik.eth, smith.box or 0x71C7..."
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
                    'Searching for Box domain via Web3.bio API' :
                    isValidEthereumAddress(searchInput) ? 
                      'Valid Ethereum address' : 
                      'Enter a valid ENS name (.eth or .box) or Ethereum address'}
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
