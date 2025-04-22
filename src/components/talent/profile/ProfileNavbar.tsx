
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Home, 
  MessageSquare
} from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet
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
      </div>
    </div>
  );
};

export default ProfileNavbar;
