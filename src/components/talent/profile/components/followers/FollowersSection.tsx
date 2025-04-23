
import React from 'react';
import HeaderContainer from '../HeaderContainer';
import { useToast } from '@/hooks/use-toast';

const FollowersSection = () => {
  const { toast } = useToast();
  
  const handleClick = () => {
    toast({
      title: "Followers feature coming soon",
      description: "This feature is currently under development"
    });
  };

  return (
    <HeaderContainer>
      <div className="flex flex-col space-y-4">
        <h3 className="text-lg font-medium tracking-tight">Followers</h3>
        <p className="text-sm text-muted-foreground">
          Followers section is coming soon. Connect your blockchain identity to unlock social features.
        </p>
        <button 
          onClick={handleClick}
          className="bg-primary hover:bg-primary/90 text-white py-1.5 px-3 rounded-md text-sm">
          Show details
        </button>
      </div>
    </HeaderContainer>
  );
};

export default FollowersSection;
