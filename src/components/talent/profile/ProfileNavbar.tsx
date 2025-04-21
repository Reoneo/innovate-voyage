
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, Save } from 'lucide-react';

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
    <div className="flex items-center mb-4">
      <Link to="/">
        <img 
          src="https://img.icons8.com/?size=512&id=uNaaq8c2jqFp&format=png" 
          alt="Back to Home" 
          className="h-10 w-10"
        />
      </Link>
      
      <div className="ml-auto flex items-center space-x-4">
        {/* XMTP Message Button */}
        <img 
          src="https://cdn-icons-png.flaticon.com/512/953/953810.png" 
          alt="Message" 
          className="h-10 w-10 cursor-pointer hover:opacity-80"
          onClick={handleOpenXmtpModal}
          title="XMTP Messages"
        />

        {/* Wallet Options */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <img 
              src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
              alt="Options" 
              className="h-10 w-10 cursor-pointer hover:opacity-80"
            />
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
