
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
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
  const [isAnimating, setIsAnimating] = useState(false);
  const navigate = useNavigate();
  
  // Get dominant color from avatar and set up animation
  useEffect(() => {
    const getAvatarColor = () => {
      const profileAvatar = document.querySelector('.profile-avatar img') as HTMLImageElement;
      if (profileAvatar && profileAvatar.complete) {
        try {
          const canvas = document.createElement('canvas');
          const context = canvas.getContext('2d');
          canvas.width = 1;
          canvas.height = 1;
          context?.drawImage(profileAvatar, 0, 0, 1, 1);
          const [r, g, b] = context?.getImageData(0, 0, 1, 1).data || [99, 102, 241];
          const color = `rgb(${r}, ${g}, ${b})`;
          setAvatarColor(color);
          
          // Start animation
          setIsAnimating(true);
          setTimeout(() => setIsAnimating(false), 1500);
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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      // Convert search to lowercase for case-insensitive matching
      const searchTerm = search.trim().toLowerCase();
      // Remove trailing slash if present and navigate
      const path = searchTerm.endsWith('/') ? searchTerm.slice(0, -1) : searchTerm;
      navigate(`/${path}`);
      window.location.reload();
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center h-14">
        <form 
          onSubmit={handleSearch} 
          className="flex items-center justify-center w-full gap-2"
        >
          <Link 
            to="/" 
            className={`flex items-center justify-center text-primary ${isAnimating ? 'animate-pulse' : ''}`} 
            style={{ color: avatarColor }}
          >
            <Home className="h-5 w-5" />
          </Link>
          
          <div className="relative flex-1 max-w-md mx-auto">
            <Search 
              className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
              aria-hidden="true"
            />
            <Input
              type="text"
              placeholder="Search ENS username..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`pl-10 pr-4 py-2 w-full bg-gray-50 border-gray-200 rounded-full focus:ring-primary focus:border-primary transition-colors ${isAnimating ? 'animate-pulse' : ''}`}
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
          
          <button
            onClick={handleOpenXmtpModal}
            className="flex items-center justify-center text-gray-600 hover:text-primary transition-colors"
            aria-label="XMTP Messages"
          >
            <div className="h-7 w-7 rounded-full overflow-hidden flex items-center justify-center">
              <img 
                src="https://d392zik6ho62y0.cloudfront.net/images/xmtp-logo.png" 
                alt="XMTP Messages" 
                className="h-7 w-7 object-cover"
              />
            </div>
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProfileNavbar;
