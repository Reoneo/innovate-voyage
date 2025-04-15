
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Save, Home, Search } from 'lucide-react';
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
  const [showSearch, setShowSearch] = useState(false);

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
      onSearch(searchQuery.trim());
    }
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  return (
    <div className="flex items-center justify-center mb-4 gap-4">
      {/* Home Icon Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleHomeClick}
        className="h-12 w-12 p-0"
        title="Home"
      >
        <Home className="h-8 w-8" />
      </Button>
      
      {/* Search Component */}
      <div className="flex-1 max-w-xs">
        {showSearch ? (
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
        ) : null}
      </div>
      
      {/* XMTP Message Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleOpenXmtpModal}
        className="h-12 w-12 p-0"
        title="XMTP Messages"
      >
        <img 
          src="https://cdn-icons-png.flaticon.com/512/953/953810.png" 
          alt="Message" 
          className="h-8 w-8"
        />
      </Button>

      {/* Search Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleSearch}
        className="h-12 w-12 p-0"
        title="Search"
      >
        <Search className="h-8 w-8" />
      </Button>

      {/* Save Options Button - Only showing for connected wallets */}
      {connectedWallet && (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-12 w-12 p-0">
              <Save className="h-8 w-8" />
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
  );
};

export default ProfileNavbar;
