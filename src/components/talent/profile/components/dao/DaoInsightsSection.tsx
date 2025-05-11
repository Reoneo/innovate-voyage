
import React, { useState, useEffect } from 'react';
import { mainnetProvider } from '@/utils/ethereumProviders';
import { ethers } from 'ethers';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Simplified ABI for ERC20 tokens
const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)",
  "function name() view returns (string)",
  "function delegates(address) view returns (address)",
  "function getCurrentVotes(address) view returns (uint256)"
];

// Common DAO tokens to check
const DAO_TOKENS = [
  { name: 'Compound', address: '0xc00e94cb662c3520282e6f5717214004a7f26888', symbol: 'COMP' },
  { name: 'Uniswap', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI' },
  { name: 'Aave', address: '0x7Fc66500c84A76Ad7e9c93437bFc5Ac33E2DDaE9', symbol: 'AAVE' },
  { name: 'ApeCoin', address: '0x4d224452801ACEd8B2F0aebE155379bb5D594381', symbol: 'APE' },
  { name: 'Gitcoin', address: '0xDe30da39c46104798bB5aA3fe8B9e0e1F348163F', symbol: 'GTC' },
  { name: 'ENS', address: '0xC18360217D8F7Ab5e7c516566761Ea12Ce7F9D72', symbol: 'ENS' },
  { name: 'Maker', address: '0x9f8F72aA9304c8B593d555F12eF6589cC3A579A2', symbol: 'MKR' }
];

interface DaoToken {
  name: string;
  symbol: string;
  balance: string;
  formattedBalance: string;
  delegatee?: string;
  votingPower?: string;
}

interface DaoInsightsSectionProps {
  walletAddress: string;
}

const DaoInsightsSection: React.FC<DaoInsightsSectionProps> = ({ walletAddress }) => {
  const [tokens, setTokens] = useState<DaoToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDaoTokens = async () => {
      if (!walletAddress) return;

      setLoading(true);
      setError(null);
      
      // Configure provider with Infura API key
      const infuraProvider = new ethers.JsonRpcProvider(
        "https://mainnet.infura.io/v3/a48e86456d8043f6bce467b4076ab638"
      );

      try {
        const tokenResults: DaoToken[] = [];
        
        // Process tokens in parallel for better performance
        const promises = DAO_TOKENS.map(async (daoToken) => {
          try {
            const tokenContract = new ethers.Contract(
              daoToken.address,
              ERC20_ABI,
              infuraProvider
            );
            
            // Get token balance
            const balance = await tokenContract.balanceOf(walletAddress);
            const decimals = await tokenContract.decimals();
            const formattedBalance = ethers.formatUnits(balance, decimals);
            
            // Only include tokens with non-zero balance
            if (balance > 0n) {
              let delegatee = null;
              let votingPower = null;
              
              // Try to get delegation info if it's a governance token
              try {
                delegatee = await tokenContract.delegates(walletAddress);
                // Only fetch voting power if the address has self-delegated or if someone else delegated to them
                if (delegatee !== ethers.ZeroAddress) {
                  votingPower = await tokenContract.getCurrentVotes(walletAddress);
                  votingPower = ethers.formatUnits(votingPower, decimals);
                }
              } catch (err) {
                // Not all tokens have delegation functions, so this might fail
                console.log(`No delegation info for ${daoToken.name}`, err);
              }
              
              return {
                name: daoToken.name,
                symbol: daoToken.symbol,
                balance: balance.toString(),
                formattedBalance: parseFloat(formattedBalance).toFixed(4),
                delegatee: delegatee && delegatee !== ethers.ZeroAddress ? delegatee : undefined,
                votingPower: votingPower ? parseFloat(votingPower).toFixed(4) : undefined
              };
            }
            return null;
          } catch (err) {
            console.error(`Error fetching ${daoToken.name} data:`, err);
            return null;
          }
        });
        
        // Wait for all promises to resolve
        const results = await Promise.all(promises);
        
        // Filter out null results and add to tokens array
        results.forEach(result => {
          if (result) tokenResults.push(result);
        });
        
        setTokens(tokenResults);
      } catch (err) {
        console.error('Error fetching DAO data:', err);
        setError('Failed to load DAO data');
      } finally {
        setLoading(false);
      }
    };

    fetchDaoTokens();
  }, [walletAddress]);

  if (error) {
    return (
      <Card className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="text-center p-6">
          <p className="text-red-500">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-white/90 shadow-md rounded-lg p-4 mb-6 backdrop-blur-sm">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800">DAO Dashboard</h2>
        <p className="text-sm text-gray-500">On-chain governance participation</p>
      </div>
      
      <Tabs defaultValue="memberships">
        <TabsList className="mb-4">
          <TabsTrigger value="memberships">Memberships</TabsTrigger>
          <TabsTrigger value="voting">Voting Power</TabsTrigger>
        </TabsList>
        
        <TabsContent value="memberships">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tokens.length > 0 ? (
            <div className="space-y-3">
              {tokens.map(token => (
                <div key={token.symbol} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-semibold">{token.name}</span>
                    <Badge variant="outline" className="ml-2">{token.symbol}</Badge>
                  </div>
                  <div>
                    <span className="font-mono">{token.formattedBalance}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No DAO memberships found for this address</p>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="voting">
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : tokens.filter(t => t.votingPower).length > 0 ? (
            <div className="space-y-3">
              {tokens.filter(t => t.votingPower).map(token => (
                <div key={`voting-${token.symbol}`} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <span className="font-semibold">{token.name}</span>
                    <Badge variant="outline" className="ml-2">{token.symbol}</Badge>
                  </div>
                  <div className="text-right">
                    <div className="font-mono">{token.votingPower}</div>
                    <div className="text-xs text-gray-500">
                      {token.delegatee && token.delegatee.toLowerCase() === walletAddress.toLowerCase() 
                        ? 'Self-delegated' 
                        : 'Delegated'}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <p>No voting power found for this address</p>
              <p className="text-sm mt-2">
                This could mean tokens aren't delegated yet or the address hasn't received any delegations
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default DaoInsightsSection;
