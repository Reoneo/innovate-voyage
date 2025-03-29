
import React, { useState } from 'react';
import { SearchIcon, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';

interface TalentSearchProps {
  onSearch: (query: string) => void;
  onViewAll: () => void;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, onViewAll }) => {
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  
  const handleSearch = () => {
    if (!searchInput.trim()) return;
    
    setIsSearching(true);
    onSearch(searchInput.trim());
    
    // Reset searching state after a delay
    setTimeout(() => setIsSearching(false), 1500);
  };
  
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div className="md:col-span-2">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Find Web3 Talent</h2>
              <p className="text-sm text-muted-foreground">
                Search by ENS name (.eth) or Ethereum wallet address
              </p>
            </div>
            <div className="relative mt-2">
              <Input
                placeholder="vitalik.eth or 0x71C7656EC7ab88b098defB751B7401B5f6d8976F"
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
                    'Searching for ENS name' : 
                    isValidEthereumAddress(searchInput) ? 
                      'Valid Ethereum address' : 
                      'Enter a valid ENS name or Ethereum address'}
                </>
              )}
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-2">
            <Button 
              onClick={handleSearch} 
              disabled={isSearching || !searchInput.trim() || (!searchInput.includes('.eth') && !isValidEthereumAddress(searchInput))}
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
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
