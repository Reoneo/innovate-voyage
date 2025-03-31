
import React, { useState, useEffect } from 'react';
import { SearchIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Alert } from '@/components/ui/alert';
import { toast } from 'sonner';

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
    hasExecutedSearch && (searchInput.includes('.eth') || searchInput.includes('.box')) ? searchInput : undefined,
    hasExecutedSearch && isValidEthereumAddress(searchInput) ? searchInput : undefined
  );
  
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    // Validate input before searching
    const isValidInput = searchInput.includes('.eth') || searchInput.includes('.box') || isValidEthereumAddress(searchInput);
    
    if (!isValidInput) {
      toast.error('Please enter a valid ENS name (.eth or .box) or Ethereum address');
      return;
    }
    
    // Set flag to execute the search
    setHasExecutedSearch(true);
    
    // Pass the input to the parent component for searching
    onSearch(searchInput.trim());
  };

  // Format input for ENS if needed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    
    // Auto-append .eth if the input looks like an ENS name without extension
    if (value && !value.includes('.') && !value.startsWith('0x') && /^[a-zA-Z0-9]+$/.test(value)) {
      setSearchInput(value); // Keep the input clean in the field
    } else {
      setSearchInput(value);
    }
  };

  // Update results only when resolver finishes and finds something
  useEffect(() => {
    if (hasExecutedSearch && !isLoading && (resolvedEns || resolvedAddress)) {
      setSearchResults([{
        name: resolvedEns || searchInput,
        address: resolvedAddress,
        avatar: avatarUrl
      }]);
    } else if (hasExecutedSearch && !isLoading && !resolvedEns && !resolvedAddress) {
      setSearchResults([]);
    }
  }, [resolvedEns, resolvedAddress, avatarUrl, isLoading, searchInput, hasExecutedSearch]);

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
                onChange={handleInputChange}
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
