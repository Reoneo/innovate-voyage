
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTalentProtocolBlockchainData } from '@/hooks/useTalentProtocolBlockchainData';
import { useWebacyData } from '@/hooks/useWebacyData';
import { fetchUserNfts } from '@/api/services/openseaService';

interface BlockchainExperienceProps {
  walletAddress: string;
}

const BlockchainExperience: React.FC<BlockchainExperienceProps> = ({ walletAddress }) => {
  const { data, isLoading, error } = useTalentProtocolBlockchainData(walletAddress);
  const { securityData, isLoading: webacyLoading } = useWebacyData(walletAddress);
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
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'Outgoing Transactions',
      value: data.outgoingTransactions || '0',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'ETH Balance',
      value: data.ethBalance || '0.0000',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'Contracts Deployed (Testnet)',
      value: data.contractsDeployedTestnet || '0',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'Active Smart Contracts',
      value: data.activeSmartContracts || '0',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'Contracts Deployed (Mainnet)',
      value: data.contractsDeployedMainnet || '0',
      icon: 'https://cryptologos.cc/logos/ethereum-eth-logo.png'
    },
    {
      label: 'NFT Collections',
      value: nftCount !== null ? nftCount.toString() : '0',
      icon: 'https://cdn-icons-png.flaticon.com/512/6699/6699362.png'
    },
    {
      label: 'Risk Score',
      value: securityData?.riskScore !== undefined ? Math.round(securityData.riskScore).toString() : 'N/A',
      icon: 'https://img.cryptorank.io/coins/webacy1675847088001.png'
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
      <CardContent className="space-y-3">
        {metrics.map((metric, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-black/20 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              <img 
                src={metric.icon} 
                alt={metric.label} 
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-gray-300">{metric.label}</span>
            </div>
            <span className="text-sm font-bold text-white">{metric.value}</span>
          </div>
        ))}
      </CardContent>
    </div>
  );
};

export default BlockchainExperience;
