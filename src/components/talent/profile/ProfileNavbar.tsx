import React, { useState, useEffect } from 'react';
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
  avatarUrl?: string;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet,
  onDisconnect,
  onSaveChanges,
  onSearch,
  avatarUrl
}) => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [buttonColor, setButtonColor] = useState('#7C3AED'); // Default color (purple)

  useEffect(() => {
    if (avatarUrl) {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          
          canvas.width = img.width;
          canvas.height = img.height;
          
          ctx.drawImage(img, 0, 0);
          
          const pixelData = ctx.getImageData(
            Math.floor(img.width / 2), 
            Math.floor(img.height / 2), 
            1, 1
          ).data;
          
          const r = pixelData[0];
          const g = pixelData[1];
          const b = pixelData[2];
          const hexColor = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
          
          setButtonColor(hexColor);
        } catch (err) {
          console.error('Error extracting color from avatar:', err);
        }
      };
      img.onerror = () => {
        console.error('Error loading avatar image for color extraction');
      };
      img.src = avatarUrl;
    }
  }, [avatarUrl]);

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
      const formattedQuery = searchQuery.trim();
      window.location.href = `/${formattedQuery}/`;
    }
  };

  return (
    <div className="bg-white z-50 py-1 shadow-md">
      <div className="flex items-center justify-center gap-4 max-w-screen-lg mx-auto">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleHomeClick}
          className="h-14 w-14 p-0" 
          title="Home"
        >
          <Home className="h-10 w-10" />
        </Button>
        
        <div className="flex-1 max-w-md">
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              type="text"
              placeholder="ENS name or ETH address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button 
              type="submit" 
              size="sm"
              style={{ backgroundColor: buttonColor }}
              className="hover:opacity-90 transition-all"
            >
              Search
            </Button>
          </form>
        </div>
        
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenXmtpModal}
          className="h-14 w-14 p-0"
          title="XMTP Messages"
        >
          <MessageSquare className="h-10 w-10" />
        </Button>

        {connectedWallet && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-14 w-14 p-0">
                <Save className="h-10 w-10" />
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
