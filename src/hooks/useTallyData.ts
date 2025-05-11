
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';

interface TallyData {
  daoName: string;
  daoSymbol: string;
  daoIcon?: string;
  votingPower: string;
  receivedDelegations: string;
  delegatingTo?: string;
}

const ENS_GOVERNANCE_ADDRESS = '0x323A76393544d5ecca80cd6ef2A560C6a395b7E3';
const ENS_TOKEN_ADDRESS = '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72';

// Minimal ERC20 ABI for balance checks
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)'
];

// Governance ABI for delegation checks
const GOVERNANCE_ABI = [
  'function getVotes(address account) view returns (uint256)',
  'function delegates(address account) view returns (address)'
];

export function useTallyData(walletAddress?: string) {
  const [tallyData, setTallyData] = useState<TallyData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTallyData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        // Initialize provider with Infura
        const provider = new ethers.JsonRpcProvider(
          'https://mainnet.infura.io/v3/a48e86456d8043f6bce467b4076ab638'
        );

        // Initialize token and governance contracts
        const ensToken = new ethers.Contract(ENS_TOKEN_ADDRESS, ERC20_ABI, provider);
        const ensGovernance = new ethers.Contract(ENS_GOVERNANCE_ADDRESS, GOVERNANCE_ABI, provider);

        // Get token info
        const tokenSymbol = await ensToken.symbol();
        const tokenName = await ensToken.name();
        const decimals = await ensToken.decimals();
        
        // Get token balance
        const balance = await ensToken.balanceOf(walletAddress);
        const formattedBalance = ethers.formatUnits(balance, decimals);
        
        // Get voting power and delegations
        const votes = await ensGovernance.getVotes(walletAddress);
        const formattedVotes = ethers.formatUnits(votes, decimals);
        
        // Get delegate address
        const delegateAddress = await ensGovernance.delegates(walletAddress);
        const isDelegating = delegateAddress !== ethers.ZeroAddress && 
                            delegateAddress.toLowerCase() !== walletAddress.toLowerCase();

        // Check if receiving delegations
        const receivingDelegations = formattedVotes > 0 && 
                                    Number(formattedVotes) > Number(formattedBalance);

        // Build data object
        setTallyData({
          daoName: tokenName,
          daoSymbol: tokenSymbol,
          daoIcon: "https://raw.githubusercontent.com/ensdomains/media/master/icons/ENS.png",
          votingPower: Number(formattedVotes) < 0.01 ? "<0.01" : formattedVotes,
          receivedDelegations: receivingDelegations ? "Yes" : "No",
          delegatingTo: isDelegating ? `${delegateAddress.slice(0, 6)}...${delegateAddress.slice(-4)}` : undefined
        });
      } catch (err) {
        console.error("Error fetching DAO data:", err);
        setError("Failed to fetch DAO data");
        setTallyData(null);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchTallyData();
  }, [walletAddress]);

  return { tallyData, isLoading, error };
}
