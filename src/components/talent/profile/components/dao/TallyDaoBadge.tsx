
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';

interface TallyDaoBadgeProps {
  walletAddress: string;
  onClick?: () => void;
  isLoading?: boolean;
}

const TallyDaoBadge: React.FC<TallyDaoBadgeProps> = ({ walletAddress, onClick, isLoading }) => {
  const { tallyData, isLoading: dataLoading } = useTallyData(walletAddress);

  if (isLoading || dataLoading) {
    return <Skeleton className="h-28 w-full" />;
  }

  return (
    <div onClick={onClick} className="cursor-pointer transition-all hover:opacity-80">
      <div className="flex flex-col items-center gap-2 p-4 rounded-lg bg-gradient-to-r from-blue-900 to-blue-700 h-full">
        <div className="flex items-center justify-center gap-2 w-full">
          <img
            src="https://cdn-icons-png.freepik.com/512/7554/7554364.png"
            alt="Tally DAO"
            className="h-6 w-6"
          />
          <div className="text-white text-lg font-semibold">Tally DAO</div>
        </div>
        <div className="text-center w-full mt-2">
          <div className="text-3xl font-bold text-white">
            {tallyData?.delegations || 0}
          </div>
          <p className="text-sm text-white/80">
            {tallyData?.delegations === 1 ? "Delegation" : "Delegations"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default TallyDaoBadge;
