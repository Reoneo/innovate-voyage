
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
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

interface TalentSearchProps {
  onSearch: (query: string) => void;
  isSearching: boolean;
}

// Define supported domain extensions
const SUPPORTED_DOMAINS = ['.eth', '.box', '.base.eth', '.linea.eth', '.lens', '.sol', '.bit', '.nft', '.crypto', '.blockchain', '.wallet', '.dao'];

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState<Array<{name: string, address?: string, avatar?: string}>>([]);
  const [hasExecutedSearch, setHasExecutedSearch] = useState(false);
  const [isValidInput, setIsValidInput] = useState(false);
  
  // Initialize resolver but don't trigger it automatically
  const { resolvedAddress, resolvedEns, avatarUrl, isLoading, error } = useEnsResolver(
    hasExecutedSearch && isValidInput ? searchInput : undefined,
    hasExecutedSearch && isValidEthereumAddress(searchInput) ? searchInput : undefined
  );
  
  // Effect to check if input is valid
  useEffect(() => {
    const checkValidity = async () => {
      if (!searchInput.trim()) {
        setIsValidInput(false);
        return;
      }
      
      // Check if it's an Ethereum address
      if (isValidEthereumAddress(searchInput)) {
        setIsValidInput(true);
        return;
      }
      
      // Check if it has a supported domain extension
      const hasSupportedExtension = SUPPORTED_DOMAINS.some(ext => searchInput.includes(ext));
      if (hasSupportedExtension) {
        setIsValidInput(true);
        return;
      }
      
      // If no extension, assume it might be a plain ENS name
      if (!searchInput.includes('.') && /^[a-zA-Z0-9]+$/.test(searchInput)) {
        setIsValidInput(true);
        return;
      }
      
      // For other cases, check if web3.bio API can resolve it
      try {
        const profile = await fetchWeb3BioProfile(searchInput);
        setIsValidInput(!!profile);
      } catch {
        setIsValidInput(false);
      }
    };
    
    checkValidity();
  }, [searchInput]);

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    
    if (!isValidInput) {
      toast.error('Please enter a valid identity (ENS, address, Farcaster, Lens, etc.)');
      return;
    }
    
    // Set flag to execute the search
    setHasExecutedSearch(true);
    
    // Try to resolve with web3.bio directly for immediate feedback
    try {
      const profile = await fetchWeb3BioProfile(searchInput);
      if (profile) {
        toast.success(`Found profile for ${profile.displayName || profile.identity}`);
      }
    } catch (error) {
      console.error("Error pre-resolving profile:", error);
    }
    
    // Pass the input to the parent component for searching
    onSearch(searchInput.trim());
  };

  // Format input for ENS if needed
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.trim();
    setSearchInput(value);
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
              Search by ENS, address, Farcaster, Lens, Unstoppable Domains and more
            </p>
          </div>
          
          <div className="flex gap-2">
            <div className="relative flex-grow">
              <Input
                placeholder="vitalik.eth, 0x71C7..., or just vitalik"
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
              disabled={isSearching || isLoading || !searchInput.trim() || !isValidInput}
            >
              {isSearching || isLoading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="text-xs text-center text-muted-foreground">
            {searchInput && (
              <div className="mt-1">
                {isValidInput ? (
                  <>
                    {searchInput.includes('.eth') ? 
                      'Searching for ENS name on Ethereum Mainnet' : 
                      searchInput.includes('.box') ?
                        'Searching for Box domain' :
                        searchInput.includes('.lens') ?
                          'Searching for Lens profile' :
                          searchInput.includes('.base.eth') ?
                            'Searching for Basenames domain' :
                            searchInput.includes('.linea.eth') ?
                              'Searching for Linea Name Service domain' :
                              searchInput.startsWith('0x') ? 
                                'Valid Ethereum address' : 
                                'Searching for identity across platforms'}
                  </>
                ) : (
                  <span className="text-red-500">Please enter a valid web3 identity</span>
                )}
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-2 text-xs justify-center">
            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">.eth</span>
            <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full">.lens</span>
            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full">.box</span>
            <span className="px-2 py-1 bg-amber-100 text-amber-800 rounded-full">.base.eth</span>
            <span className="px-2 py-1 bg-pink-100 text-pink-800 rounded-full">.linea.eth</span>
            <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full">Address</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
