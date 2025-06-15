import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConnectButton } from '@rainbow-me/rainbowkit';

// Define the props type for ProfileNavbar
type ProfileNavbarProps = {
  connectedWallet?: string | null;
  onDisconnect?: () => void;
  onSaveChanges?: () => void;
};

const ICON_SIZE = 24;

// Accept props and use default values just in case
const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet,
  onDisconnect,
  onSaveChanges,
}) => {
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

  // Keyboard shortcut for opening search
  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchPopoverOpen(true);
      }
      // Escape closes search if open
      if (e.key === 'Escape') setSearchPopoverOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  return (
    <>
      <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30 w-full`}>
        <div className={`mx-auto px-2 sm:px-4 py-2 flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'} max-w-full`}>
          {/* Left: Home Button & Search Button */}
          <div className="flex items-center gap-0">
            <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0 flex items-center" aria-label="Home">
              <Home className="h-6 w-6" size={ICON_SIZE} />
            </Link>
            <Button
              variant="ghost"
              aria-label="Open search"
              tabIndex={0}
              className="ml-1 p-0 rounded-full px-0 py-0 my-0 mx-0 text-white flex items-center justify-center h-6 w-6"
              style={{ minWidth: ICON_SIZE, minHeight: ICON_SIZE }}
              onClick={() => setSearchPopoverOpen((v) => !v)}
            >
              <Search className="h-6 w-6" size={ICON_SIZE} />
            </Button>
          </div>
          {/* Center: Flexible spacer to keep right-aligned button */}
          <div className="flex-1 flex justify-center" />
          {/* Right: WalletConnect */}
          <div className="flex-shrink-0 flex items-center">
            <ConnectButton accountStatus="avatar" chainStatus="full" showBalance={false} />
          </div>
        </div>
      </div>
      {/* Search Bar Popup BELOW navbar */}
      {searchPopoverOpen && (
        <div
          className="fixed left-0 right-0 z-40"
          style={{
            top: isMobile ? 48 : 56, // Height of navbar: 12 * 4 or 14 * 4
          }}
        >
          <div className="w-full flex justify-center animate-fade-in">
            <div className="w-full max-w-3xl bg-gray-800/95 border border-gray-700 rounded-b-2xl shadow-xl px-5 py-4 mt-0 flex flex-col gap-2 relative">
              <button
                onClick={() => setSearchPopoverOpen(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-white p-1 transition"
                aria-label="Close search"
                tabIndex={0}
              >
                {/* Simple X icon (close) */}
                <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l8 8M14 6l-8 8"/></svg>
              </button>
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-4"
                role="search"
                aria-label="Search user by ENS or address"
              >
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Search ENS username or address…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="flex-1 bg-white/90 text-black placeholder:text-gray-500 rounded-xl border-2 border-primary px-5 py-3 text-base focus:ring-2 focus:ring-primary focus:border-primary shadow-inner"
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
                  className="rounded-xl font-semibold shadow hover:shadow-md transition"
                  aria-label="Search"
                >
                  Search
                </Button>
              </form>
              <div className="text-xs text-gray-300/80 text-center">
                Try searching by ENS or Ethereum address
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileNavbar;
