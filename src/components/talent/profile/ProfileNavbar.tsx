
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
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [searchPopoverOpen]);

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30 w-full`}>
      <div className={`mx-auto px-2 sm:px-4 py-2 flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'} max-w-full`}>
        {/* Left: Home Button */}
        <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0 flex items-center" aria-label="Home">
          <Home className="h-6 w-6" size={ICON_SIZE} />
        </Link>
        {/* Center: (empty to maintain space) */}
        <div className="flex-1 flex justify-center" />
        {/* Right: Search Icon and WalletConnect */}
        <div className="flex items-center gap-2">
          {/* Search Popover */}
          <Popover open={searchPopoverOpen} onOpenChange={setSearchPopoverOpen}>
            <PopoverTrigger asChild>
              <Button 
                variant="ghost" 
                aria-label="Open search" 
                tabIndex={0} 
                className="p-1 rounded-full px-0 py-0 my-0 mx-0 text-white"
              >
                <Search className="h-6 w-6" size={ICON_SIZE} />
              </Button>
            </PopoverTrigger>
            {searchPopoverOpen && (
              <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-[2px]">
                <div className="w-full max-w-xs md:max-w-md bg-gray-800/90 border border-gray-700 rounded-2xl shadow-2xl p-6 flex flex-col gap-4 relative animate-fade-in">
                  <button
                    onClick={() => setSearchPopoverOpen(false)}
                    className="absolute top-3 right-4 text-gray-400 hover:text-white p-1 transition"
                    aria-label="Close search"
                    tabIndex={0}
                  >
                    <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l8 8M14 6l-8 8"/></svg>
                  </button>
                  <form
                    onSubmit={handleSearch}
                    className="flex flex-col items-center gap-3"
                    role="search"
                    aria-label="Search user by ENS or address"
                  >
                    <Input
                      ref={inputRef}
                      type="text"
                      placeholder="Search ENS username, address, or handle…"
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full bg-white/90 text-black placeholder:text-gray-500 rounded-xl border-2 border-primary px-5 py-3 text-base focus:ring-2 focus:ring-primary focus:border-primary shadow-inner"
                      aria-label="Search input"
                      autoFocus
                      onKeyDown={e => {
                        if (e.key === 'Escape') setSearchPopoverOpen(false);
                      }}
                    />
                    <Button
                      type="submit"
                      size="lg"
                      variant="default"
                      className="w-full rounded-xl font-semibold shadow hover:shadow-md transition"
                      aria-label="Search"
                    >
                      Search
                    </Button>
                  </form>
                  <div className="text-xs text-gray-300/80 mt-2 mx-auto text-center">
                    Try ENS, Ethereum address, or Farcaster handle
                  </div>
                </div>
              </div>
            )}
          </Popover>
          <div className="flex-shrink-0 flex items-center">
            <ConnectButton accountStatus="avatar" chainStatus="full" showBalance={false} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
