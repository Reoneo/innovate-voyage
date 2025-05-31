
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet
}) => {
  const [search, setSearch] = useState('');
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

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30">
      <div className={`mx-auto px-1 md:px-3 py-1 md:py-2 flex items-center justify-between ${isMobile ? 'h-10' : 'h-12 md:h-14'} max-w-full`}>
        <form onSubmit={handleSearch} className="flex-1 flex items-center justify-center gap-1 md:gap-2">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0">
            <Home className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4 md:h-5 md:w-5'}`} />
          </Link>
          
          <div className={`relative w-full ${isMobile ? 'max-w-[200px] mx-1' : 'max-w-xs mx-1 md:max-w-sm md:mx-2'}`}>
            <Search className={`absolute left-1.5 md:left-2 md:left-3 top-1/2 transform -translate-y-1/2 ${isMobile ? 'h-2.5 w-2.5' : 'h-3 w-3'} text-gray-400`} aria-hidden="true" />
            <Input 
              type="text" 
              placeholder={isMobile ? "Search..." : "Search ENS..."} 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className={`${isMobile ? 'pl-5 pr-8 py-0.5 text-xs h-7' : 'pl-6 pr-10 py-1 text-xs md:pl-8 md:pr-12 md:py-1 md:text-sm'} w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white`} 
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className={`absolute right-0.5 md:right-1 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 ${isMobile ? 'px-1 py-0 text-xs h-6' : 'px-1 py-0.5 text-xs md:px-2 md:py-0.5 md:text-xs'}`}
            >
              {isMobile ? ">" : "Go"}
            </Button>
          </div>
          
          <button 
            onClick={handleOpenXmtpModal} 
            className="text-white hover:text-gray-300 transition-colors flex-shrink-0" 
            aria-label="XMTP Messages"
          >
            <img 
              src="https://raw.githubusercontent.com/xmtp/brand/main/assets/x-mark-red.png" 
              alt="XMTP Messages" 
              className={`${isMobile ? 'h-3.5 w-3.5' : 'h-4 w-4 md:h-5 md:w-5'}`}
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileNavbar;
