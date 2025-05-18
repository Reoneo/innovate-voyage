
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Share2, Download, Save, LogOut } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();
  
  return (
    <header className={`fixed top-0 left-0 right-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200 transition-all ${isMobile ? 'py-4' : 'py-2'}`}>
      <div className="container mx-auto px-4 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Link to="/" className="flex items-center">
            <img 
              src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" 
              alt="Logo" 
              className={`${isMobile ? 'h-8 w-8' : 'h-6 w-6'} mr-2`} 
            />
            <span className={`font-semibold text-gray-800 ${isMobile ? 'text-xl' : 'text-base'}`}>
              recruitment.box
            </span>
          </Link>
        </div>
        
        <div className="flex items-center gap-2">
          {connectedWallet && (
            <>
              <Button 
                size={isMobile ? "default" : "sm"} 
                variant="ghost" 
                onClick={onSaveChanges}
              >
                <Save className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Save</span>
              </Button>
              
              <Button 
                size={isMobile ? "default" : "sm"} 
                variant="ghost" 
                onClick={onDisconnect}
              >
                <LogOut className="mr-1 h-4 w-4" />
                <span className="hidden sm:inline">Disconnect</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default ProfileNavbar;
