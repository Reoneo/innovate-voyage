
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
        <Button variant="ghost" size="sm" className="gap-1 p-0">
          <img 
            src="https://img.icons8.com/?size=512&id=uNaaq8c2jqFp&format=png" 
            alt="Back to Home" 
            className="h-10 w-10"
          />
        </Button>
      </Link>
      
      <div className="ml-auto flex items-center space-x-2">
        {/* XMTP Message Button */}
        <Button
          variant="ghost"
          size="icon"
          onClick={handleOpenXmtpModal}
          className="h-10 w-10 p-0"
          title="XMTP Messages"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/953/953810.png" 
            alt="Message" 
            className="h-10 w-10"
          />
        </Button>

        {/* Wallet Button - Only showing save option */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-10 w-10 p-0">
              <img 
                src="https://cdn-icons-png.flaticon.com/512/1077/1077114.png" 
                alt="Options" 
                className="h-10 w-10"
              />
            </Button>
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
