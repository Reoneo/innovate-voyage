import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
const ICON_SIZE = 24;
const ProfileNavbar: React.FC = () => {
  const [searchPopoverOpen, setSearchPopoverOpen] = useState(false);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      setSearchPopoverOpen(false);
      navigate(`/recruitment.box/${searchTerm}/`);
      window.location.reload();
    }
  };

  // Focus input when popover opens
  React.useEffect(() => {
    if (searchPopoverOpen && inputRef.current) {
      // Slight timeout to allow for popover rendering first
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchPopoverOpen]);
  return <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30 w-full`}>
      <div className={`mx-auto px-2 sm:px-4 py-2 flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'} max-w-full`}>
        {/* Left: Home Button */}
        <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0 flex items-center" aria-label="Home">
          <Home className="h-6 w-6" size={ICON_SIZE} />
        </Link>
        {/* Center: (empty to maintain space) */}
        <div className="flex-1 flex justify-center" />
        {/* Right: Search Icon and WalletConnect */}
        <div className="flex items-center gap-2">
          <Popover open={searchPopoverOpen} onOpenChange={setSearchPopoverOpen}>
            <PopoverTrigger asChild>
              <Button variant="ghost" aria-label="Open search" tabIndex={0} className="p-1 rounded-full px-0 py-0 my-0 mx-0 text-white">
                <Search className="h-6 w-6" size={ICON_SIZE} />
              </Button>
            </PopoverTrigger>
            <PopoverContent align="end" sideOffset={8} className="w-72 px-4 py-3 bg-background shadow-xl" asChild={false}>
              <form onSubmit={handleSearch} className="flex items-center gap-2" role="search" aria-label="Search user by ENS or address">
                <Input ref={inputRef} type="text" placeholder="Search ENS username..." value={search} onChange={e => setSearch(e.target.value)} className="w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white text-center pl-4" aria-label="Search input" autoFocus onKeyDown={e => {
                if (e.key === 'Escape') setSearchPopoverOpen(false);
              }} />
                <Button type="submit" size="sm" variant="ghost" className="text-white hover:text-gray-300" aria-label="Search">
                  Search
                </Button>
              </form>
            </PopoverContent>
          </Popover>
          <div className="flex-shrink-0 flex items-center">
            <ConnectButton accountStatus="avatar" chainStatus="full" showBalance={false} />
          </div>
        </div>
      </div>
    </div>;
};
export default ProfileNavbar;