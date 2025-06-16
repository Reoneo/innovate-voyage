
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useIsMobile } from "@/hooks/use-mobile";

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({}) => {
  const [search, setSearch] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      navigate(`/recruitment.box/${searchTerm}/`);
      window.location.reload();
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
    if (showSearch) {
      setSearch('');
    }
  };

  return (
    <div className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30 w-full`}>
      <div className={`mx-auto px-2 sm:px-4 py-2 flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'} max-w-full`}>
        {/* Left Section - Home Button */}
        <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0">
          <Home className={`${isMobile ? 'h-6 w-6' : 'h-6 w-6'}`} />
        </Link>

        {/* Center Section - Search */}
        <div className="flex-1 flex items-center justify-center gap-2 max-w-md mx-4">
          {showSearch ? (
            <form onSubmit={handleSearch} className="flex items-center gap-2 w-full">
              <div className="relative flex-1">
                <Input 
                  type="text" 
                  placeholder={isMobile ? "Search ENS..." : "Search ENS username..."} 
                  value={search} 
                  onChange={e => setSearch(e.target.value)} 
                  className={`${isMobile ? 'pl-3 pr-3 py-1 text-sm h-8' : 'pl-4 pr-4 py-2'} w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white`} 
                  autoFocus
                />
              </div>
              <Button 
                type="submit" 
                variant="ghost" 
                size="sm" 
                className={`text-white hover:text-gray-300 ${isMobile ? 'px-2 py-1 text-xs h-8' : 'px-3 py-2'}`}
              >
                Go
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                size="sm" 
                onClick={toggleSearch}
                className={`text-white hover:text-gray-300 ${isMobile ? 'px-2 py-1 text-xs h-8' : 'px-3 py-2'}`}
              >
                Cancel
              </Button>
            </form>
          ) : (
            <button 
              onClick={toggleSearch}
              className="text-white hover:text-gray-300 transition-colors"
              aria-label="Search"
            >
              <Search className={`${isMobile ? 'h-6 w-6' : 'h-6 w-6'}`} />
            </button>
          )}
        </div>

        {/* Right Section - Messages and Wallet */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="flex flex-col items-center">
            <button 
              onClick={handleOpenXmtpModal} 
              className="text-white hover:text-gray-300 transition-colors" 
              aria-label="XMTP Messages"
            >
              <img 
                src="https://raw.githubusercontent.com/xmtp/brand/main/assets/x-mark-red.png" 
                alt="XMTP Messages" 
                className={`${isMobile ? 'h-5 w-5' : 'h-6 w-6'}`}
              />
            </button>
            {!isMobile && (
              <span className="text-xs text-gray-300 mt-1">Messages</span>
            )}
          </div>
          
          <div className="flex-shrink-0">
            <ConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
