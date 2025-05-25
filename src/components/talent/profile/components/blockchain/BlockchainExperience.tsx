
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTalentProtocolBlockchainData } from '@/hooks/useTalentProtocolBlockchainData';

interface BlockchainExperienceProps {
  walletAddress: string;
}

const BlockchainExperience: React.FC<BlockchainExperienceProps> = ({ walletAddress }) => {
  const { data, isLoading, error } = useTalentProtocolBlockchainData(walletAddress);

  if (isLoading) {
    return (
      <div className="w-full rounded-lg bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-lg p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return null;
  }

  const metrics = [
    {
      label: 'First Transaction',
      value: data.firstTransaction || 'N/A',
      score: data.firstTransactionScore || '0/8',
      hasScore: true
    },
    {
      label: 'Outgoing Transactions',
      value: data.outgoingTransactions || '0',
      score: data.outgoingTransactionsScore || '0/8',
      hasScore: true
    },
    {
      label: 'ETH Balance',
      value: data.ethBalance || '0.0000',
      score: data.ethBalanceScore || '0/8',
      hasScore: true
    },
    {
      label: 'Contracts Deployed (Testnet)',
      value: data.contractsDeployedTestnet || '0',
      score: data.contractsDeployedTestnetScore || '0/4',
      hasScore: true
    },
    {
      label: 'Active Smart Contracts',
      value: data.activeSmartContracts || '0',
      score: data.activeSmartContractsScore || '0/12',
      hasScore: true
    },
    {
      label: 'Contracts Deployed (Mainnet)',
      value: data.contractsDeployedMainnet || '0',
      score: data.contractsDeployedMainnetScore || '0/8',
      hasScore: true
    }
  ];

  return (
    <div className="w-full rounded-lg bg-gradient-to-br from-[#1A1F2C]/80 via-[#7E69AB]/30 to-[#0FA0CE]/20 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-gradient-primary text-lg font-semibold tracking-wide">
          <img 
            src="https://cryptologos.cc/logos/ethereum-eth-logo.png" 
            alt="Ethereum" 
            className="w-6 h-6"
          />
          Blockchain Experience
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="flex justify-between items-center p-3 rounded-lg bg-black/20 backdrop-blur-sm">
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-300">{metric.label}</span>
                <span className="text-lg font-bold text-white">{metric.value}</span>
              </div>
              {metric.hasScore && (
                <div className="text-right">
                  <span className="text-sm font-semibold text-green-400">{metric.score} pts</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </div>
  );
};

export default BlockchainExperience;
