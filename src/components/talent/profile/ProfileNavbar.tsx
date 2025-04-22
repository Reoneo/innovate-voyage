
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, Save, LogOut } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet,
  onDisconnect,
  onSaveChanges
}) => {
  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  return (
    <div className="flex items-center mb-4 w-full">
      {/* Home Icon */}
      <Link to="/">
        <Home className="h-10 w-10 text-primary hover:text-[#8B5CF6] transition-colors"/>
      </Link>
      <div className="ml-auto flex items-center space-x-4">
        {/* XMTP Message Icon */}
        <MessageSquare
          className="h-10 w-10 cursor-pointer text-[#6E59A5] hover:text-[#0FA0CE] transition-colors"
          onClick={handleOpenXmtpModal}
          aria-label="XMTP Messages"
        />

        {/* Save Changes button for connected wallet */}
        {connectedWallet && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onSaveChanges}
            className="text-[#6E59A5] hover:text-[#0FA0CE] hover:bg-transparent"
          >
            <Save className="h-10 w-10" />
          </Button>
        )}

        {/* Disconnect button for connected wallet */}
        {connectedWallet && (
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onDisconnect}
            className="text-[#6E59A5] hover:text-[#0FA0CE] hover:bg-transparent"
          >
            <LogOut className="h-10 w-10" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProfileNavbar;
