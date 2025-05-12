
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { WalletCards, ExternalLink } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { TransactionsBadgeProps } from './types';

const TransactionsBadge: React.FC<TransactionsBadgeProps> = ({ 
  txCount, 
  walletAddress,
  isLoading
}) => {
  return (
    <Card className="cursor-pointer hover:shadow-md transition-shadow border-0 shadow-sm bg-white">
      <CardContent className="p-4 flex justify-between items-center">
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium text-muted-foreground flex items-center gap-1">
            <WalletCards className="h-4 w-4 text-primary" />
            <span>NFTs</span>
          </div>
          
          {isLoading ? (
            <Skeleton className="h-8 w-20" />
          ) : (
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-bold">
                {txCount || 'View'}
              </span>
              <span className="text-xs text-muted-foreground">Collections</span>
            </div>
          )}
          
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span>Click to see collection</span>
            <ExternalLink className="h-3 w-3" />
          </p>
        </div>
        
        <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
          <WalletCards className="h-6 w-6 text-primary" />
        </div>
      </CardContent>
    </Card>
  );
};

export default TransactionsBadge;
