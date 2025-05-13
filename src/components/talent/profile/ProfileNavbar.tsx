
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
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md border-b border-gray-600/20 shadow-md bg-gray-800/30">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-14">
        {/* Search form with Home and Chat icons positioned next to it */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center justify-center gap-2">
          <Link to="/" className="text-white hover:text-gray-300 transition-colors">
            <Home className="h-6 w-6" />
          </Link>
          
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input 
              type="text" 
              placeholder="Search ENS username..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="pl-10 pr-4 py-2 w-full bg-white/85 border-[#4C6EF5] text-gray-900 rounded-full focus:ring-[#4C6EF5] focus:border-[#4C6EF5] shadow-[0_2px_6px_rgba(76,110,245,0.25)] transition-all duration-200 text-sm font-medium placeholder:text-gray-600" 
              style={{
                backdropFilter: 'blur(5px)',
                WebkitBackdropFilter: 'blur(5px)',
              }}
            />
            <Button 
              type="submit" 
              variant="ghost" 
              size="sm" 
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#4C6EF5] hover:text-[#3355dd] px-3 py-1 font-medium"
            >
              Search
            </Button>
          </div>
          
          <button 
            onClick={handleOpenXmtpModal} 
            className="text-white hover:text-gray-300 transition-colors" 
            aria-label="XMTP Messages"
          >
            {/* New XMTP icon from GitHub repo */}
            <img 
              src="https://raw.githubusercontent.com/xmtp/brand/main/assets/x-mark-red.png" 
              alt="XMTP Messages" 
              className="h-6 w-6"
            />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileNavbar;
