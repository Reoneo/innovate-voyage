
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
import { useIsMobile } from '@/hooks/use-mobile';

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const isMobile = useIsMobile();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      return;
    }
    let searchValue = searchInput.trim();
    if (!searchValue.includes('.') && !isValidEthereumAddress(searchValue) && /^[a-zA-Z0-9]+$/.test(searchValue)) {
      searchValue = `${searchValue}.eth`;
    }
    navigate(`/${searchValue}`);
    toast.success(`Looking up profile for ${searchValue}`);
  };
  
  return (
    <div className={`${isMobile ? 'w-full px-4' : 'max-w-xl'} mx-auto mb-8`}>
      <form onSubmit={handleSearch} className="relative w-full">
        <div className="relative w-full">
          <Input 
            placeholder={isMobile ? "Search profiles..." : "Search by ENS name, address, or domain..."} 
            value={searchInput} 
            onChange={e => setSearchInput(e.target.value)} 
            aria-label="Search profiles" 
            className={`${isMobile ? 'h-12 text-sm pl-10 pr-16' : 'h-14 text-base pl-12 pr-20'} w-full border-2 border-slate-600/50 focus:border-blue-400 backdrop-blur-sm text-white placeholder:text-slate-400 rounded-xl shadow-lg transition-all duration-200 bg-white/10`} 
          />
          <div className={`absolute inset-y-0 left-0 flex items-center ${isMobile ? 'pl-3' : 'pl-4'} pointer-events-none`}>
            <Search className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'} text-slate-400`} aria-hidden="true" />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            className={`absolute ${isMobile ? 'right-1 top-1/2 transform -translate-y-1/2 h-8 px-4' : 'right-2 top-1/2 transform -translate-y-1/2 h-10 px-6'} bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200`}
          >
            {isMobile ? 'Go' : 'Search'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default SearchSection;
