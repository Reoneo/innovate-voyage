
import React, { useState, useMemo, useEffect } from 'react';
import { useEnsByAddress, useAddressByEns, useRealAvatar } from '@/hooks/useWeb3';
import { calculateHumanScore, getScoreColorClass, BlockchainPassport, isValidEthereumAddress } from '@/lib/utils';
import TalentLayout from '@/components/talent/TalentLayout';
import TalentGrid from '@/components/talent/TalentGrid';
import TalentSearch from '@/components/talent/TalentSearch';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { getAccountBalance, getTransactionCount, getLatestTransactions } from '@/api/services/etherscanService';
import { fetchAllEnsDomains } from '@/api/services/domainsService';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { toast } from 'sonner';
import { fetchWeb3BioProfile } from '@/api/utils/web3Utils';

const Talent = () => {
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlockchainPassport[]>([]);
  
  // Search specific address or ENS
  const { data: ensDataByAddress } = useEnsByAddress(addressSearch);
  const { data: addressDataByEns } = useAddressByEns(
    addressSearch.includes('.') ? addressSearch : undefined
  );
  
  // Get avatar for searched ENS
  const { data: avatarData } = useRealAvatar(
    addressSearch.includes('.') ? addressSearch : undefined
  );

  // Effect to fetch data when address search changes
  useEffect(() => {
    const fetchEtherscanData = async () => {
      if (!addressSearch) return;
      
      setIsSearching(true);
      let address = addressSearch;
      let ensName = '';
      let avatar = '/placeholder.svg';
      let additionalEnsDomains: string[] = [];
      
      try {
        // Directly try Web3.bio API first for fastest resolution
        const web3BioProfile = await fetchWeb3BioProfile(addressSearch);
        
        if (web3BioProfile && web3BioProfile.address) {
          address = web3BioProfile.address;
          ensName = web3BioProfile.displayName || web3BioProfile.identity || addressSearch;
          avatar = web3BioProfile.avatar || '/placeholder.svg';
          console.log("Found profile via Web3.bio:", web3BioProfile);
        }
        // If not found in Web3.bio, try standard resolution methods
        else if (addressSearch.includes('.')) {
          if (addressDataByEns) {
            address = addressDataByEns.address;
            ensName = addressDataByEns.ensName;
            avatar = addressDataByEns.avatar || avatarData || '/placeholder.svg';
          } else {
            // No data found, try one more ENS lookup attempt
            try {
              const { resolvedAddress } = await fetchAddressFromEns(addressSearch);
              if (resolvedAddress) {
                address = resolvedAddress;
                ensName = addressSearch;
              } else {
                setIsSearching(false);
                setSearchResults([]);
                toast.error(`Could not resolve ${addressSearch} to an address`);
                return;
              }
            } catch (lookupError) {
              console.error("ENS lookup error:", lookupError);
              setIsSearching(false);
              setSearchResults([]);
              toast.error(`Could not resolve ${addressSearch}`);
              return;
            }
          }
        } 
        // If address is provided, try to resolve ENS name
        else if (isValidEthereumAddress(addressSearch)) {
          if (ensDataByAddress) {
            ensName = ensDataByAddress.ensName;
            avatar = ensDataByAddress.avatar || '/placeholder.svg';
          }
        }
        
        // If no ENS name, use a placeholder
        if (!ensName) {
          ensName = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        
        console.log("Final resolved data:", { address, ensName, avatar });
        
        // Fetch ALL ENS domains for this address - only real ones, no mocks
        const allDomains = await fetchAllEnsDomains(address);
        if (allDomains && allDomains.length > 0) {
          // Remove the primary domain that we already have
          additionalEnsDomains = allDomains.filter(domain => domain !== ensName);
          console.log("Found additional domains:", additionalEnsDomains);
        }
        
        // Fetch blockchain data
        const [balance, txCount, latestTxs] = await Promise.all([
          getAccountBalance(address),
          getTransactionCount(address),
          getLatestTransactions(address, 5)
        ]);
        
        // Create skills array from transaction data
        const skills = [];
        if (Number(balance) > 0) skills.push('ETH Holder');
        if (txCount > 10) skills.push('Active Trader');
        if (txCount > 50) skills.push('Power User');
        if (ensName.includes('.')) skills.push('Web3 Domain Owner');
        
        // Add transaction-based skills
        if (latestTxs && latestTxs.length > 0) {
          const hasContractInteractions = latestTxs.some(tx => tx.input && tx.input !== '0x');
          if (hasContractInteractions) skills.push('Smart Contract User');
          
          // Check if they've done transactions recently (within last 30 days)
          const recentTx = latestTxs.some(tx => {
            const txDate = new Date(parseInt(tx.timeStamp) * 1000);
            const now = new Date();
            const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
            return daysDiff < 30;
          });
          
          if (recentTx) skills.push('Recently Active');
        }
        
        // Create new passport from Etherscan data
        const newPassport: BlockchainPassport = {
          passport_id: ensName,
          owner_address: address,
          avatar_url: avatar,
          name: ensName.includes('.') ? ensName.split('.')[0] : ensName,
          issued: new Date().toISOString(),
          skills: skills.map(skill => ({
            name: skill,
            proof: `etherscan://${address}`,
          })),
          socials: {},
          additionalEnsDomains
        };
        
        setSearchResults([newPassport]);
        toast.success(`Found profile for ${ensName || address}`);
      } catch (error) {
        console.error('Error fetching profile data:', error);
        toast.error('Error searching for talent profile');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchEtherscanData();
  }, [addressSearch, addressDataByEns, ensDataByAddress, avatarData]);

  // Helper function to fetch address from ENS name
  async function fetchAddressFromEns(ensName: string): Promise<{resolvedAddress?: string}> {
    try {
      // Try direct Web3.bio lookup
      const profile = await fetchWeb3BioProfile(ensName);
      if (profile && profile.address) {
        return { resolvedAddress: profile.address };
      }
      
      // Use the ens resolver as fallback
      const { resolvedAddress } = useEnsResolver(ensName);
      return { resolvedAddress };
    } catch (error) {
      console.error("Error in fetchAddressFromEns:", error);
      return {};
    }
  }

  // Process passport data
  const passportData = useMemo(() => {
    if (searchResults.length > 0) {
      return searchResults.map(passport => {
        const { score, category } = calculateHumanScore(passport);
        
        return {
          ...passport,
          score,
          category,
          colorClass: getScoreColorClass(score),
          hasMoreSkills: passport.skills?.length > 4
        };
      });
    }
    
    return [];
  }, [searchResults]);

  const handleAddressSearch = (input: string) => {
    setAddressSearch(input);
  };

  return (
    <TalentLayout 
      profileCount={passportData.length}
      transactionCount={0}
    >
      {/* Full-width search bar */}
      <div className="lg:col-span-4">
        <TalentSearch 
          onSearch={handleAddressSearch}
          isSearching={isSearching}
        />
      </div>

      {/* Talent Grid - now full width */}
      <div className="lg:col-span-4">
        <TalentGrid
          isLoading={isSearching}
          passportData={passportData}
          clearFilters={() => {}}
        />
      </div>
    </TalentLayout>
  );
};

export default Talent;
