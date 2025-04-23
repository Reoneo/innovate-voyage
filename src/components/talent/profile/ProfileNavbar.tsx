
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Home, 
  MessageSquare,
  Search
} from 'lucide-react';
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
      // Redirect to the searched profile
      const searchTerm = search.trim().toLowerCase();
      navigate(`/recruitment.box/${searchTerm}/`);
      // Reload the page to ensure the URL change takes effect
      window.location.reload();
    }
  };

  return (
    <div className="flex items-center mb-4 w-full">
      {/* Home Icon */}
      <Link to="/">
        <Home className="h-10 w-10 text-primary hover:text-[#8B5CF6] transition-colors"/>
      </Link>
      
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mx-auto w-full max-w-sm">
        <div className="relative flex items-center">
          <Input
            type="text"
            placeholder="Search ENS username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 w-full bg-white"
          />
          <Search 
            className="absolute left-3 h-4 w-4 text-gray-400"
            aria-hidden="true"
          />
          <Button 
            type="submit" 
            variant="ghost" 
            size="sm" 
            className="absolute right-1"
          >
            Search
          </Button>
        </div>
      </form>
      
      <div className="ml-auto flex items-center space-x-4">
        {/* XMTP Message Icon */}
        <MessageSquare
          className="h-10 w-10 cursor-pointer text-[#6E59A5] hover:text-[#0FA0CE] transition-colors"
          onClick={handleOpenXmtpModal}
          aria-label="XMTP Messages"
        />
      </div>
    </div>
  );
};

export default ProfileNavbar;
