
import React, { useState, useEffect } from 'react';
import { SearchIcon, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { 
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from "@/components/ui/command";

interface TalentSearchProps {
  onSearch: (query: string) => void;
  onViewAll: () => void;
  isSearching: boolean;
}

const TalentSearch: React.FC<TalentSearchProps> = ({ onSearch, onViewAll, isSearching }) => {
  const [searchInput, setSearchInput] = useState('');
  const [open, setOpen] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{name: string, address?: string, avatar?: string}>>([]);
  
  // ENS resolver for the current search input
  const { resolvedAddress, resolvedEns, avatarUrl } = useEnsResolver(
    searchInput.includes('.eth') ? searchInput : undefined,
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
    const isValidInput = searchInput.includes('.eth') || isValidEthereumAddress(searchInput);
    
    if (!isValidInput) {
      toast({
        title: "Invalid input",
        description: "Please enter a valid ENS name or Ethereum address",
        variant: "destructive"
      });
      return;
    }
    
    onSearch(searchInput.trim());
    setOpen(false);
  };

  // Handle keyboard shortcut to open command dialog
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);
  
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
                onClick={() => setOpen(true)}
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
        
        {/* Search command dialog */}
        <CommandDialog open={open} onOpenChange={setOpen}>
          <CommandInput 
            placeholder="Search ENS or address..." 
            value={searchInput} 
            onValueChange={setSearchInput}
          />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Results">
              {searchResults.map((result, index) => (
                <CommandItem 
                  key={index}
                  onSelect={() => {
                    setSearchInput(result.name);
                    handleSearch();
                  }}
                >
                  <div className="flex items-center gap-2">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={result.avatar || '/placeholder.svg'} />
                      <AvatarFallback>{result.name.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <span>{result.name}</span>
                    {result.address && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {result.address.substring(0, 6)}...{result.address.substring(result.address.length - 4)}
                      </span>
                    )}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </CommandDialog>
      </CardContent>
    </Card>
  );
};

export default TalentSearch;
