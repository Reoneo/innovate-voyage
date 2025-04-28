
import React from 'react';
import { useFollowButton } from 'ethereum-identity-kit';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface FollowButtonProps {
  lookupAddress: string;
  connectedAddress?: string | null;
  className?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?: "default" | "outline" | "secondary" | "ghost" | "link" | "destructive";
}

const FollowButton: React.FC<FollowButtonProps> = ({
  lookupAddress,
  connectedAddress,
  className = '',
  size = "default",
  variant = "default"
}) => {
  const { toast } = useToast();
  
  // Ensure addresses are in the correct format (`0x${string}`)
  const formattedLookupAddress = lookupAddress.startsWith('0x') 
    ? lookupAddress as `0x${string}` 
    : `0x${lookupAddress}` as `0x${string}`;
  
  const formattedConnectedAddress = connectedAddress && connectedAddress.startsWith('0x')
    ? connectedAddress as `0x${string}`
    : connectedAddress ? `0x${connectedAddress}` as `0x${string}` : undefined;
  
  const { 
    buttonText, 
    buttonState,
    handleAction, 
    isLoading,
    disableHover,
    setDisableHover
  } = useFollowButton({
    lookupAddress: formattedLookupAddress,
    connectedAddress: formattedConnectedAddress,
  });

  const handleClick = async () => {
    try {
      await handleAction();
      toast({
        title: buttonState === 'Follow' ? 'Following' : 'Unfollowed',
        description: buttonState === 'Follow' 
          ? `You are now following ${lookupAddress}` 
          : `You have unfollowed ${lookupAddress}`
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'There was an error processing your request',
        variant: 'destructive'
      });
    }
  };

  // Handle case when user is not connected
  if (!connectedAddress) {
    return (
      <Button
        size={size}
        variant="outline"
        className={className}
        onClick={() => toast({
          title: 'Wallet not connected',
          description: 'Please connect your wallet to follow this user',
          variant: 'destructive'
        })}
      >
        Follow
      </Button>
    );
  }

  // Don't show follow button if looking at own profile
  if (lookupAddress.toLowerCase() === connectedAddress.toLowerCase()) {
    return null;
  }

  return (
    <Button
      size={size}
      variant={buttonState === 'Following' ? 'outline' : variant}
      className={`${className} ${disableHover ? 'pointer-events-none' : ''}`}
      onClick={handleClick}
      disabled={isLoading}
      onMouseEnter={() => buttonState === 'Following' && setDisableHover(false)}
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Loading...
        </>
      ) : buttonState === 'Following' && !disableHover ? (
        'Unfollow'
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default FollowButton;
