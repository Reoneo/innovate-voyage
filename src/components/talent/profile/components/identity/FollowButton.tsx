import React from 'react';
import { useToast } from '@/hooks/use-toast';
interface FollowButtonProps {
  targetAddress: string;
  className?: string;
}
const FollowButton: React.FC<FollowButtonProps> = ({
  targetAddress,
  className
}) => {
  const {
    toast
  } = useToast();

  // Don't show follow button for your own profile
  const connectedWalletAddress = localStorage.getItem('connectedWalletAddress');
  if (connectedWalletAddress?.toLowerCase() === targetAddress?.toLowerCase()) {
    return null;
  }
  const handleClick = () => {
    if (!targetAddress) return;

    // Open the EFP app URL for the given address
    window.open(`https://efp.app/${targetAddress}`, '_blank');
  };
  return <div className={`flex justify-center mt-2 mb-2 ${className || ''}`}>
      <button onClick={handleClick} className="mx-auto">
        <img src="/lovable-uploads/99ee2ca1-bf63-4bf4-9d80-75bf2583163b.png" alt="Follow on EFP" style={{
        height: "36px"
      }} className="rounded-md hover:opacity-90 transition-opacity object-fill" />
      </button>
    </div>;
};
export default FollowButton;