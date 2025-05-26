import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTalentProtocolBlockchainData } from '@/hooks/useTalentProtocolBlockchainData';
import { useWebacyData } from '@/hooks/useWebacyData';
import { fetchUserNfts } from '@/api/services/openseaService';
interface BlockchainExperienceProps {
  walletAddress: string;
}
const BlockchainExperience: React.FC<BlockchainExperienceProps> = ({
  walletAddress
}) => {
  const {
    data,
    isLoading,
    error
  } = useTalentProtocolBlockchainData(walletAddress);
  const {
    securityData,
    isLoading: webacyLoading
  } = useWebacyData(walletAddress);
  const [nftCount, setNftCount] = useState<number | null>(null);
  const [nftLoading, setNftLoading] = useState(true);
  useEffect(() => {
    if (!walletAddress) return;
    const getNftCount = async () => {
      try {
        const collections = await fetchUserNfts(walletAddress);
        const totalNfts = collections.reduce((total, collection) => total + collection.nfts.length, 0);
        setNftCount(totalNfts);
      } catch (error) {
        console.error("Error fetching NFT count:", error);
      } finally {
        setNftLoading(false);
      }
    };
    getNftCount();
  }, [walletAddress]);
  if (isLoading || webacyLoading || nftLoading) {
    return <div className="w-full rounded-lg bg-white shadow-sm border border-gray-200 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-300 rounded w-3/4"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-5/6"></div>
            <div className="h-4 bg-gray-300 rounded w-4/6"></div>
          </div>
        </div>
      </div>;
  }
  if (error || !data) {
    return null;
  }
  const basicMetrics = [{
    label: 'First Transaction',
    value: data.firstTransaction || 'N/A',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040'
  }, {
    label: 'Outgoing Transactions',
    value: data.outgoingTransactions || '0',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040'
  }, {
    label: 'NFT Collections',
    value: nftCount !== null ? nftCount.toString() : '0',
    icon: 'https://cdn.worldvectorlogo.com/logos/opensea.svg'
  }, {
    label: 'Risk Score',
    value: securityData?.riskScore !== undefined ? Math.round(securityData.riskScore).toString() : 'N/A',
    icon: 'https://img.cryptorank.io/coins/webacy1675847088001.png'
  }];
  const skillsMetrics = [{
    label: 'Contracts Deployed (Testnet)',
    value: data.contractsDeployedTestnet || '0',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040'
  }, {
    label: 'Active Smart Contracts',
    value: data.activeSmartContracts || '0',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040'
  }, {
    label: 'Contracts Deployed (Mainnet)',
    value: data.contractsDeployedMainnet || '0',
    icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png?v=040'
  }];
  return;
};
export default BlockchainExperience;