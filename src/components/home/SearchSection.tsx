
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { resolveAddressToEns } from '@/utils/ensResolution';

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      return;
    }

    let searchValue = searchInput.trim();
    setIsSearching(true);

    try {
      // Check if input is a valid Ethereum address
      if (isValidEthereumAddress(searchValue)) {
        console.log(`Searching for ENS domain for address: ${searchValue}`);
        toast.info('Looking up primary ENS domain...');
        
        // Try to resolve address to primary ENS domain
        const ensResult = await resolveAddressToEns(searchValue);
        
        if (ensResult && ensResult.ensName) {
          console.log(`Found primary ENS domain: ${ensResult.ensName}`);
          toast.success(`Found primary ENS domain: ${ensResult.ensName}`);
          navigate(`/${ensResult.ensName}`);
        } else {
          // No primary ENS found, search by address directly
          console.log(`No primary ENS found, searching by address: ${searchValue}`);
          toast.info('No primary ENS domain found, showing available profile data...');
          navigate(`/${searchValue}`);
        }
      } else {
        // Handle ENS name search
        if (!searchValue.includes('.') && /^[a-zA-Z0-9]+$/.test(searchValue)) {
          searchValue = `${searchValue}.eth`;
        }
        
        console.log(`Searching for ENS domain: ${searchValue}`);
        toast.success(`Looking up profile for ${searchValue}`);
        navigate(`/${searchValue}`);
      }
    } catch (error) {
      console.error('Search error:', error);
      toast.error('Error during search, showing what we can find...');
      navigate(`/${searchValue}`);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input 
            placeholder="Search by ENS name, wallet address, or domain..." 
            value={searchInput} 
            onChange={e => setSearchInput(e.target.value)} 
            disabled={isSearching}
            aria-label="Search profiles" 
            className="h-14 text-base pl-12 pr-20 border-2 border-slate-600/50 focus:border-blue-400 backdrop-blur-sm text-white placeholder:text-slate-400 rounded-xl shadow-lg transition-all duration-200 bg-white/10" 
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-6 w-6 text-slate-400" aria-hidden="true" />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            disabled={isSearching || !searchInput.trim()}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 text-white font-medium rounded-lg transition-all duration-200"
          >
            {isSearching ? 'Searching...' : 'Search'}
          </Button>
        </div>
      </form>
      
      <div className="mt-3 text-center">
        <p className="text-xs text-slate-400">
          Enter a wallet address to find primary ENS domain or any available profile data
        </p>
      </div>
    </div>
  );
};

export default SearchSection;
