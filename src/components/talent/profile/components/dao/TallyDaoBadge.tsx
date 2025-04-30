
import React from 'react';
import { Button } from '@/components/ui/button';

interface TallyDaoBadgeProps {
  walletAddress?: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const TallyDaoBadge: React.FC<TallyDaoBadgeProps> = ({ 
  onClick, 
  isLoading = false 
}) => {
  return (
    <Button
      variant="outline"
      className="h-auto flex flex-col items-center justify-center py-4 px-6 border bg-white shadow-sm hover:bg-gray-50 transition-colors"
      onClick={onClick}
      disabled={isLoading}
    >
      <div className="flex items-center justify-center mb-1">
        <img 
          src="https://substackcdn.com/image/fetch/w_1360,c_limit,f_webp,q_auto:best,fl_progressive:steep/https%3A%2F%2Fsubstack-post-media.s3.amazonaws.com%2Fpublic%2Fimages%2F16e04a51-6718-44ad-b41e-01598da994b6_1280x1280.png" 
          alt="Tally DAO"
          className="w-12 h-12"
        />
      </div>
      <span className="text-sm font-medium">DAO Governance</span>
      <span className="text-xs text-gray-500 mt-1">View on Tally</span>
    </Button>
  );
};

export default TallyDaoBadge;
