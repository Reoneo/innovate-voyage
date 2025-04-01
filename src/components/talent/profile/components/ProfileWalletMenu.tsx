
import React from 'react';
import { Wallet, LogOut, Save, Download } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

interface ProfileWalletMenuProps {
  connectedWallet: string | null;
  onExportPDF: () => void;
}

const ProfileWalletMenu: React.FC<ProfileWalletMenuProps> = ({ connectedWallet, onExportPDF }) => {
  const { toast } = useToast();

  const handleDisconnect = () => {
    localStorage.removeItem('connectedWalletAddress');
    window.location.reload(); // Reload to update wallet state across components
    toast({
      title: "Wallet disconnected",
      description: "You've been successfully disconnected from your wallet."
    });
  };
  
  const handleSaveChanges = () => {
    toast({
      title: "Changes saved",
      description: "Your profile changes have been saved successfully."
    });
  };

  return (
    <div className="ml-auto">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon">
            <Wallet className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {connectedWallet ? (
            <>
              <DropdownMenuItem onClick={handleSaveChanges}>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDisconnect}>
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
          <DropdownMenuItem onClick={onExportPDF}>
            <Download className="mr-2 h-4 w-4" />
            Export as PDF
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ProfileWalletMenu;
