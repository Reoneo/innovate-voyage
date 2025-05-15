
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ethers } from 'ethers';
import { formatFixed } from '@ethersproject/bignumber';

interface DaoInsightsSectionProps {
  walletAddress: string;
}

const DaoInsightsSection: React.FC<DaoInsightsSectionProps> = ({ walletAddress }) => {
  const [daoData, setDaoData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchDaoData = async () => {
      if (!walletAddress) return;
      
      setLoading(true);
      try {
        // This is a placeholder for actual DAO data fetching logic
        // In a real implementation, you would query relevant contracts or APIs
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // For now, just provide some mock data
        const mockDaoData = [
          {
            name: 'Uniswap',
            tokenSymbol: 'UNI',
            votingPower: '128.45',
            proposalsVoted: 7,
            delegatedTo: null
          },
          {
            name: 'Aave',
            tokenSymbol: 'AAVE',
            votingPower: '5.2',
            proposalsVoted: 3,
            delegatedTo: '0x1234...5678'
          }
        ];
        
        setDaoData(mockDaoData);
      } catch (error) {
        console.error('Error fetching DAO data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDaoData();
  }, [walletAddress]);

  // Format address for display
  const formatAddress = (address: string): string => {
    if (!address) return '';
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
  };

  // Format big numbers using ethers utils
  const formatTokenAmount = (amount: string, decimals = 18): string => {
    try {
      // Use ethersproject formatFixed instead of ethers.utils
      return formatFixed(amount, decimals);
    } catch (error) {
      return amount;
    }
  };

  // Check if an address is a zero address
  const isZeroAddress = (address: string): boolean => {
    if (!address) return false;
    // Use direct comparison instead of ethers.constants
    return address === "0x0000000000000000000000000000000000000000";
  };

  if (!walletAddress) return null;

  return (
    <section className="mt-4">
      <h3 className="text-lg font-semibold mb-3">DAO Governance</h3>
      
      {loading ? (
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      ) : daoData.length > 0 ? (
        <div className="space-y-3">
          {daoData.map((dao, index) => (
            <div key={index} className="border rounded-lg p-3 bg-card">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{dao.name}</h4>
                <span className="bg-primary/10 text-primary text-xs py-1 px-2 rounded-full">
                  {dao.tokenSymbol}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-y-2 text-sm">
                <div className="text-muted-foreground">Voting Power</div>
                <div className="font-medium">{dao.votingPower} {dao.tokenSymbol}</div>
                
                <div className="text-muted-foreground">Proposals Voted</div>
                <div className="font-medium">{dao.proposalsVoted}</div>
                
                {dao.delegatedTo && (
                  <>
                    <div className="text-muted-foreground">Delegated To</div>
                    <div className="font-medium">{formatAddress(dao.delegatedTo)}</div>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 px-4 border border-dashed rounded-lg">
          <p className="text-muted-foreground">No DAO participation found</p>
        </div>
      )}
    </section>
  );
};

export default DaoInsightsSection;
