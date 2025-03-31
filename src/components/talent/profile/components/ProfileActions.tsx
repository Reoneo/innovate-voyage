
import React from 'react';
import { useToast } from '@/hooks/use-toast';
import { Wallet, LogOut, Save, Download } from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

interface ProfileActionsProps {
  connectedWallet: string | null;
  onExportPDF: () => void;
}

const ProfileActions: React.FC<ProfileActionsProps> = ({ connectedWallet, onExportPDF }) => {
  const { toast } = useToast();
  
  const handleDisconnect = () => {
    localStorage.removeItem('connectedWalletAddress');
    document.dispatchEvent(new Event('wallet-disconnected')); // Custom event for parent components
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="ml-2">
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
  );
};

export default ProfileActions;
