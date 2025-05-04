
import React from 'react';
import { Button } from '@/components/ui/button';
import { initiateLinkedInAuth } from '@/api/services/linkedinService';

interface LinkedInConnectButtonProps {
  className?: string;
}

const LinkedInConnectButton: React.FC<LinkedInConnectButtonProps> = ({ className }) => {
  const handleConnect = () => {
    // Store current path to return after auth
    localStorage.setItem('linkedin_return_path', window.location.pathname);
    
    // Initiate OAuth flow
    initiateLinkedInAuth();
  };

  return (
    <Button
      onClick={handleConnect}
      variant="outline"
      className={`flex items-center gap-2 ${className || ''}`}
    >
      <img 
        src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
        alt="LinkedIn" 
        className="w-5 h-5" 
      />
      Connect LinkedIn
    </Button>
  );
};

export default LinkedInConnectButton;
