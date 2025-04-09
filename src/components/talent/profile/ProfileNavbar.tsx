
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Wallet, LogOut, Save, Download, ArrowLeft, MessageSquare } from 'lucide-react';

interface ProfileNavbarProps {
  connectedWallet: string | null;
  onDisconnect: () => void;
  onSaveChanges: () => void;
  onExportPdf: () => void;
}

const ProfileNavbar: React.FC<ProfileNavbarProps> = ({
  connectedWallet,
  onDisconnect,
  onSaveChanges,
  onExportPdf
}) => {
  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  return (
    <div className="flex items-center mb-4">
      <Link to="/">
        <Button variant="outline" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      
      <div className="ml-auto flex items-center space-x-2">
        {/* XMTP Message Button */}
        <Button
          variant="outline"
          size="icon"
          onClick={handleOpenXmtpModal}
          className="h-9 w-9"
          title="XMTP Messages"
        >
          <img 
            src="https://cdn-icons-png.flaticon.com/512/953/953810.png" 
            alt="Message" 
            className="h-4 w-4"
          />
        </Button>

        {/* Wallet Button */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Wallet className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {connectedWallet ? (
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
            ) : (
              <DropdownMenuItem onClick={() => document.dispatchEvent(new Event('open-wallet-connect'))}>
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={onExportPdf}>
              <Download className="mr-2 h-4 w-4" />
              Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default ProfileNavbar;
