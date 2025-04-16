
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Save, Home, MessageSquare } from 'lucide-react';
import { Input } from "@/components/ui/input";

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
  onSearch: (query: string) => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet,
  onDisconnect,
  onSaveChanges,
  onSearch
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  const handleHomeClick = () => {
    navigate('/');
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Correct the URL format for searches
      window.location.href = `/recruitment.box/${searchQuery.trim()}/`;
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 bg-white z-50 py-2 shadow-md">
      <div className="flex items-center justify-center gap-4 max-w-screen-lg mx-auto">
        {/* Home Icon Button - Increased size */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          className="h-16 w-16 p-0" 
          title="Home"
        >
          <Home className="h-12 w-12" />
        </Button>
        
        {/* Search Bar - Always visible */}
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="ENS name or ETH address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" size="sm">
              Search
            </Button>
          </form>
        </div>
        
        {/* XMTP Message Button - Increased size */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenXmtpModal}
          className="h-16 w-16 p-0"
          title="XMTP Messages"
        >
          <MessageSquare className="h-12 w-12" />
        </Button>

        {/* Save Options Button - Only showing for connected wallets - Increased size */}
        {connectedWallet && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-16 w-16 p-0">
                <Save className="h-12 w-12" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={onSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onDisconnect}>
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  );
};

export default ProfileNavbar;
