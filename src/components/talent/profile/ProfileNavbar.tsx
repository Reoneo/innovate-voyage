
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from "@/hooks/use-mobile";
import { ConnectButton } from '@rainbow-me/rainbowkit';

interface ProfileNavbarProps {
  onSaveChanges: () => void;
}

const ICON_SIZE = 28; // Home icon and wallet/avatar size

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  onSaveChanges,
}) => {
  const [search, setSearch] = useState('');
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      const searchTerm = search.trim().toLowerCase();
      navigate(`/recruitment.box/${searchTerm}/`);
      window.location.reload();
    }
  };

  return (
    <div className="relative z-50">
      {/* Top-right RainbowKit ConnectButton */}
      <div
        className="fixed top-2 sm:top-4 right-2 sm:right-4 z-[60] flex items-center gap-3"
        style={{
          height: ICON_SIZE,
          width: ICON_SIZE,
          minWidth: ICON_SIZE,
          minHeight: ICON_SIZE,
        }}
      >
        {/* Wrap the button for correct sizing, RainbowKit ConnectButton includes chainStatus for network switching */}
        <div
          className="flex items-center justify-center rounded-full overflow-hidden"
          style={{
            height: ICON_SIZE,
            width: ICON_SIZE,
            minWidth: ICON_SIZE,
            minHeight: ICON_SIZE,
            background: 'transparent'
          }}
        >
          <ConnectButton
            accountStatus="avatar"
            chainStatus="full"
            showBalance={false}
          />
        </div>
      </div>

      {/* Navigation Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30 w-full">
        <div className={`mx-auto px-2 sm:px-4 py-2 flex items-center justify-between ${isMobile ? 'h-12' : 'h-14'} max-w-full`}>
          {/* Home, Search bar, Search button */}
          <form onSubmit={handleSearch} className="flex-1 flex items-center justify-center gap-1 sm:gap-2">
            <Link
              to="/"
              className="text-white hover:text-gray-300 transition-colors flex-shrink-0 h-7 w-7 flex items-center justify-center"
              style={{
                height: ICON_SIZE,
                width: ICON_SIZE,
              }}
              aria-label="Home"
            >
              <Home className="h-7 w-7" style={{ height: ICON_SIZE, width: ICON_SIZE }} />
            </Link>
            <div className={`relative w-full ${isMobile ? 'max-w-none mx-1' : 'max-w-md'}`}>
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isMobile ? 'h-3 w-3' : 'h-4 w-4'} text-gray-400`} aria-hidden="true" />
              <Input
                type="text"
                placeholder={isMobile ? "Search ENS..." : "Search ENS username..."}
                value={search}
                onChange={e => setSearch(e.target.value)}
                className={`${isMobile ? 'pl-8 pr-12 py-1 text-sm h-8' : 'pl-10 pr-4 py-2'} w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white text-center`}
              />
              <Button
                type="submit"
                variant="ghost"
                size="sm"
                className={`absolute right-1 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 ${isMobile ? 'px-1 py-0.5 text-xs h-6' : 'px-3 py-1'}`}
              >
                {isMobile ? 'Go' : 'Search'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
