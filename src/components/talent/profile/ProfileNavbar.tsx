
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet
}) => {
  const [search, setSearch] = useState('');
  const [avatarColor, setAvatarColor] = useState('#6366f1'); // Default color
  const navigate = useNavigate();
  
  // Get dominant color from avatar
  useEffect(() => {
    const getAvatarColor = () => {
      const profileAvatar = document.querySelector('.profile-avatar img') as HTMLImageElement;
      if (profileAvatar && profileAvatar.complete) {
        try {
          // Use the first valid image on the page as a fallback
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 1;
          canvas.height = 1;
          context?.drawImage(profileAvatar, 0, 0, 1, 1);
          const [r, g, b] = context?.getImageData(0, 0, 1, 1).data || [99, 102, 241];
          const color = `rgb(${r}, ${g}, ${b})`;
          setAvatarColor(color);
        } catch (e) {
          console.log('Error getting avatar color:', e);
        }
      }
    };
    
    // Try after a short delay to ensure image is loaded
    setTimeout(getAvatarColor, 1000);
    
    // Also add an event listener to the image
    const profileAvatar = document.querySelector('.profile-avatar img');
    if (profileAvatar) {
      profileAvatar.addEventListener('load', getAvatarColor);
      return () => profileAvatar.removeEventListener('load', getAvatarColor);
    }
  }, []);

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  const handleOpenConnectWalletModal = () => {
    if (!connectedWallet) {
      if (window.walletConnectModal) {
        window.walletConnectModal.showModal();
      }
    } else {
      // Disconnect wallet
      localStorage.removeItem('connectedWalletAddress');
      window.connectedWalletAddress = null;
      
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected successfully."
      });
      
      // Reload the page to reflect changes
      setTimeout(() => window.location.reload(), 1500);
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
        <div className="flex-none w-14">
          <Link to="/" className="flex items-center text-primary font-medium" style={{ color: avatarColor }}>
            <Home className="h-6 w-6" />
          </Link>
        </div>
        
        <form 
          onSubmit={handleSearch} 
          className="flex-1 flex justify-center"
        >
          <div className="relative max-w-md w-full">
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
              style={{ 
                borderColor: avatarColor,
                '--tw-ring-color': avatarColor, 
              } as React.CSSProperties}
            />
            <Button
              type="submit"
              variant="ghost"
              size="sm"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 hover:text-primary/80 px-3 py-1"
              style={{ color: avatarColor }}
            >
              Search
            </Button>
          </div>
        </form>

        <div className="flex-none w-14 flex justify-end space-x-4">
          <button
            onClick={handleOpenXmtpModal}
            className="flex items-center text-gray-600 hover:text-primary transition-colors"
            aria-label="XMTP Messages"
          >
            <img 
              src="https://d392zik6ho62y0.cloudfront.net/images/xmtp-logo.png" 
              alt="XMTP Messages" 
              className="h-10 w-10" // Doubled in size
            />
          </button>
          
          <button
            onClick={handleOpenConnectWalletModal}
            className="flex items-center text-gray-600 hover:text-primary transition-colors ml-4"
            aria-label="Connect Wallet"
          >
            <Wallet className="h-6 w-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavbar;
