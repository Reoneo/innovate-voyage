
import { useQuery } from '@tanstack/react-query';

interface TalentProtocolBlockchainData {
  firstTransaction: string;
  firstTransactionScore: string;
  outgoingTransactions: number;
  outgoingTransactionsScore: string;
  ethBalance: string;
  ethBalanceScore: string;
  contractsDeployedTestnet: number;
  contractsDeployedTestnetScore: string;
  activeSmartContracts: number;
  activeSmartContractsScore: string;
  contractsDeployedMainnet: number;
  contractsDeployedMainnetScore: string;
}

const fetchTalentProtocolBlockchainData = async (walletAddress: string): Promise<TalentProtocolBlockchainData> => {
  // Mock data for now - replace with actual Talent Protocol API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        firstTransaction: '18 April 2024',
        firstTransactionScore: '8/8',
        outgoingTransactions: 419,
        outgoingTransactionsScore: '8/8',
        ethBalance: '0.0004',
        ethBalanceScore: '4/8',
        contractsDeployedTestnet: 0,
        contractsDeployedTestnetScore: '0/4',
        activeSmartContracts: 0,
        activeSmartContractsScore: '0/12',
        contractsDeployedMainnet: 0,
        contractsDeployedMainnetScore: '0/8'
      });
    }, 1000);
  });
};

export const useTalentProtocolBlockchainData = (walletAddress: string) => {
  return useQuery({
    queryKey: ['talentProtocolBlockchain', walletAddress],
    queryFn: () => fetchTalentProtocolBlockchainData(walletAddress),
    enabled: !!walletAddress,
    staleTime: 300000, // 5 minutes
    retry: 2
  });
};
