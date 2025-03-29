
import React from 'react';
import { Users, BarChart } from 'lucide-react';

interface TalentLayoutProps {
  profileCount: number;
  transactionCount?: number;
  children: React.ReactNode;
}

const TalentLayout: React.FC<TalentLayoutProps> = ({ profileCount, transactionCount, children }) => {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Web3 Talent Network
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover blockchain-verified professionals with on-chain credentials
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
              <span>{profileCount} profiles</span>
            </div>
            {transactionCount !== undefined && (
              <div className="text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg flex items-center gap-1">
                <BarChart className="h-4 w-4" />
                <span>{transactionCount} transactions</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default TalentLayout;
