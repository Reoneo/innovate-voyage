
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Wallet, LogOut, Save, Download, Home, Search, MessageSquare } from 'lucide-react';

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
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Navigate to recruitment.box/{userName} to properly refresh the page data
      window.location.href = `https://recruitment.box/${searchQuery.trim()}/`;
    }
  };

  const handleOpenXmtpModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.showModal();
    }
  };

  return (
    <div className="flex flex-col items-center mb-4 w-full">
      <div className="flex items-center gap-4 w-full max-w-2xl">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9"
          onClick={() => navigate('/')}
        >
          <Home className="h-5 w-5" />
        </Button>
        
        <form onSubmit={handleSearch} className="flex-1">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search ENS or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground pointer-events-none" />
          </div>
        </form>
        
        <div className="flex items-center gap-2">
          {/* Message Button */}
          <Button
            variant="outline"
            size="icon"
            onClick={handleOpenXmtpModal}
            className="h-9 w-9"
          >
            <MessageSquare className="h-4 w-4" />
          </Button>

          {/* Wallet Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="h-9 w-9">
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
    </div>
  );
};

export default ProfileNavbar;
