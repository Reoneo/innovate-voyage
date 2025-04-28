
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, MessageSquare, Search } from 'lucide-react';
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
    <div className="w-full flex flex-col items-center justify-center mb-3 relative">
      <div className="flex items-center justify-center gap-3 mb-1">
        <Link to="/" className="flex items-center justify-center">
          <Home className="h-5 w-5 text-primary hover:text-[#8B5CF6] transition-colors" />
        </Link>
        <div className="flex items-center justify-center">
          <MessageSquare
            className="h-5 w-5 cursor-pointer text-[#6E59A5] hover:text-[#0FA0CE] transition-colors"
            onClick={handleOpenXmtpModal}
            aria-label="XMTP Messages"
          />
        </div>
      </div>

      <form 
        onSubmit={handleSearch} 
        className="w-full sm:max-w-md flex items-center relative justify-center"
      >
        <Input
          type="text"
          placeholder="Search ENS username..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 pr-4 py-1 w-full bg-white border-[1.4px] border-[#9b87f5] rounded-full shadow focus:outline-none focus:ring-2 focus:ring-[#8B5CF6] transition"
        />
        <Search 
          className="absolute left-3 h-4 w-4 text-[#8B5CF6]"
          aria-hidden="true"
        />
        <Button
          type="submit"
          variant="ghost"
          size="sm"
          className="absolute right-2 text-primary hover:text-[#8B5CF6] px-2 py-1"
        >
          Search
        </Button>
      </form>
    </div>
  );
};

export default ProfileNavbar;
