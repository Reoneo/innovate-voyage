
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ethers } from 'ethers';
import { truncateAddress } from '@/lib/utils';

interface OnchainMetrics {
  ethBalance?: string;
  firstTxHash?: string;
  firstTxDate?: string;
  outgoingTxCount?: number;
  activeContracts?: number;
  mainnetDeployments?: number;
  testnetDeployments?: number;
}

interface DaoInsightsSectionProps {
  walletAddress?: string;
}

const OnchainActivitySection: React.FC<DaoInsightsSectionProps> = ({ walletAddress }) => {
  const [metrics, setMetrics] = useState<OnchainMetrics>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchOnchainData = async () => {
      setLoading(true);
      try {
        // For demonstration, we're setting mock data
        // In a real implementation, you would fetch this data from Etherscan API or similar
        const mockData: OnchainMetrics = {
          ethBalance: '4.2186',
          firstTxHash: '0x83f7d2271a6f43b8525ab61c41c1b2c00e7fd887ad9ce7bc5ef69f35fa684bb9',
          firstTxDate: '2019-03-21',
          outgoingTxCount: 381,
          activeContracts: 18,
          mainnetDeployments: 3,
          testnetDeployments: 7
        };
        
        // Simulate network request
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setMetrics(mockData);
      } catch (error) {
        console.error('Error fetching onchain data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnchainData();
  }, [walletAddress]);

  // Format date to human-readable
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }).format(date);
    } catch (e) {
      return dateString;
    }
  };

  // Link to Etherscan
  const getEtherscanUrl = (hash?: string) => {
    if (!hash) return '';
    return `https://etherscan.io/tx/${hash}`;
  };

  return (
    <Card className="bg-white shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center gap-2">
          <span>Onchain Activity</span>
        </CardTitle>
        <CardDescription>
          Ethereum blockchain metrics for {truncateAddress(walletAddress)}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* ETH Balance */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">ETH Balance</p>
            {loading ? (
              <Skeleton className="h-6 w-20" />
            ) : (
              <p className="text-lg font-semibold">{metrics.ethBalance || '0'} ETH</p>
            )}
          </div>
          
          {/* First Transaction */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">First Transaction</p>
            {loading ? (
              <Skeleton className="h-6 w-32" />
            ) : (
              <p className="text-md font-medium">
                {metrics.firstTxDate ? (
                  <a 
                    href={getEtherscanUrl(metrics.firstTxHash)}
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {formatDate(metrics.firstTxDate)}
                  </a>
                ) : (
                  'No transactions'
                )}
              </p>
            )}
          </div>
          
          {/* Transaction Count */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Transactions</p>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold">{metrics.outgoingTxCount || '0'}</p>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          {/* Active Contracts */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Active Smart Contracts</p>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold">{metrics.activeContracts || '0'}</p>
            )}
          </div>
          
          {/* Contracts Deployed (Mainnet) */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Mainnet Deployments</p>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold">{metrics.mainnetDeployments || '0'}</p>
            )}
          </div>
          
          {/* Contracts Deployed (Testnet) */}
          <div className="space-y-1">
            <p className="text-sm font-medium text-gray-500">Testnet Deployments</p>
            {loading ? (
              <Skeleton className="h-6 w-16" />
            ) : (
              <p className="text-lg font-semibold">{metrics.testnetDeployments || '0'}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OnchainActivitySection;
