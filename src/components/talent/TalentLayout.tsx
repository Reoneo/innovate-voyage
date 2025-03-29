
import React from 'react';
import { Users, Home, Wallet } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

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
          
          <div className="flex items-center gap-2">
            <Link to="/">
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                <span>Home</span>
              </Button>
            </Link>
            <Button variant="outline" size="sm" className="flex items-center gap-1" onClick={() => window.connectWalletModal.showModal()}>
              <Wallet className="h-4 w-4" />
              <span>Connect Wallet</span>
            </Button>
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
