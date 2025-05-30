
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // Convert search to lowercase for case-insensitive matching
      const searchTerm = search.trim().toLowerCase();
      navigate(`/recruitment.box/${searchTerm}/`);
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-sm bg-gray-800/30">
      <div className="w-full px-2 sm:px-4 py-2 flex items-center justify-between h-14">
        {/* Mobile optimized layout */}
        <div className="flex items-center gap-2 flex-1">
          {/* Home icon */}
          <Link to="/" className="text-white hover:text-gray-300 transition-colors flex-shrink-0">
            <Home className="h-5 w-5 sm:h-6 sm:w-6" />
          </Link>
          
          {/* Search form - takes remaining space */}
          <form onSubmit={handleSearch} className="flex-1 max-w-sm">
            <div className="relative">
              <Search className="absolute left-2 sm:left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" aria-hidden="true" />
              <Input 
                type="text" 
                placeholder="Search ENS..." 
                value={search} 
                onChange={e => setSearch(e.target.value)} 
                className="pl-7 sm:pl-10 pr-2 py-1.5 sm:py-2 w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white text-sm sm:text-base" 
              />
            </div>
          </form>
          
          {/* XMTP icon */}
          <button 
            onClick={handleOpenXmtpModal} 
            className="text-white hover:text-gray-300 transition-colors flex-shrink-0" 
            aria-label="XMTP Messages"
          >
            <img 
              src="https://raw.githubusercontent.com/xmtp/brand/main/assets/x-mark-red.png" 
              alt="XMTP Messages" 
              className="h-5 w-5 sm:h-6 sm:w-6"
            />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
