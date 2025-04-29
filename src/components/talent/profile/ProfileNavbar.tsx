
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Search } from 'lucide-react';
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
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between h-14">
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2 text-primary font-medium">
            <Home className="h-5 w-5" />
          </Link>
          
          <button
            onClick={handleOpenXmtpModal}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            aria-label="XMTP Messages"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        </div>

        <form 
          onSubmit={handleSearch} 
          className="w-full max-w-md relative"
        >
          <div className="relative">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Search ENS username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-full focus:ring-primary focus:border-primary"
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-primary hover:text-primary/80 px-3 py-1"
            >
              Search
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileNavbar;
