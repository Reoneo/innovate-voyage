
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, MessageSquare, X } from 'lucide-react';
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
    <div className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-gray-800/30 border-b border-gray-600/20 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-14">
        {/* Home icon positioned on the left */}
        <div className="flex-none w-14 flex justify-center">
          <Link to="/" className="flex items-center justify-center text-white font-medium">
            <Home className="h-6 w-6" />
          </Link>
        </div>
        
        {/* Search form in the center */}
        <form onSubmit={handleSearch} className="flex-1 flex justify-center">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" aria-hidden="true" />
            <Input type="text" placeholder="Search ENS username..." value={search} onChange={e => setSearch(e.target.value)} className="pl-10 pr-4 py-2 w-full bg-gray-700/30 border-gray-600/30 text-white rounded-full focus:ring-white focus:border-white" />
            <Button type="submit" variant="ghost" size="sm" className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-300 px-3 py-1">
              Search
            </Button>
          </div>
        </form>

        {/* XMTP icon positioned on the right */}
        <div className="flex-none w-14 flex justify-center">
          <button onClick={handleOpenXmtpModal} className="flex items-center justify-center text-white hover:text-gray-300 transition-colors" aria-label="XMTP Messages">
            <MessageSquare className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
