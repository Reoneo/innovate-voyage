import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';

const SearchSection: React.FC = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');

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

  return <div className="max-w-xl mx-auto mb-8">
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <Input 
            placeholder="Search by ENS ID" 
            value={searchInput} 
            onChange={e => setSearchInput(e.target.value)} 
            aria-label="Search profiles" 
            className="h-14 text-base pl-12 pr-20 border-2 border-slate-600/50 focus:border-blue-400 backdrop-blur-sm text-white placeholder:text-slate-400 rounded-xl shadow-lg transition-all duration-200 bg-white/10" 
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
            <Search className="h-6 w-6 text-slate-400" aria-hidden="true" />
          </div>
          <Button 
            type="submit" 
            size="sm" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200"
          >
            Search
          </Button>
        </div>
      </form>
    </div>;
};

export default SearchSection;
