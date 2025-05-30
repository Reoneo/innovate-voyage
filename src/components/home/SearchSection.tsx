
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

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSearch} className="flex gap-3">
        <div className="relative flex-grow group">
          <Input
            placeholder="Search by ENS name, address, or domain..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="h-14 text-base pl-14 pr-4 border-2 border-cyan-500/30 focus:border-cyan-400 bg-black/30 backdrop-blur-sm text-white placeholder:text-gray-400 rounded-xl shadow-2xl shadow-cyan-500/20 transition-all duration-300 group-hover:shadow-cyan-500/30"
            aria-label="Search profiles"
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-5 pointer-events-none">
            <Search className="h-6 w-6 text-cyan-400 animate-pulse" aria-hidden="true" />
          </div>
          {/* Glow effect */}
          <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/10 to-purple-500/10 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"></div>
        </div>
        <Button 
          type="submit" 
          size="lg" 
          className="h-14 px-8 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold rounded-xl shadow-2xl shadow-cyan-500/30 border border-cyan-500/30 transition-all duration-300 hover:shadow-cyan-500/50 hover:scale-105"
        >
          <Search className="mr-2 h-5 w-5" />
          Search
        </Button>
      </form>
    </div>
  );
};

export default SearchSection;
