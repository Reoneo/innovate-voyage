
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Home, MessageSquare, MoreHorizontal, Save, LogOut } from 'lucide-react';

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
          title="XMTP Messages"
        />

        {/* Options Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <MoreHorizontal className="h-10 w-10 cursor-pointer text-muted-foreground hover:text-[#8B5CF6] transition-colors"/>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {connectedWallet && (
              <>
                <DropdownMenuItem onClick={onSaveChanges}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onDisconnect}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Disconnect
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileNavbar;
