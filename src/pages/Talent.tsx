
import React, { useState, useMemo, useEffect } from 'react';
import { useEnsByAddress, useAddressByEns, useRealAvatar } from '@/hooks/useWeb3';
import { calculateHumanScore, getScoreColorClass, BlockchainPassport } from '@/lib/utils';
import TalentLayout from '@/components/talent/TalentLayout';
import TalentGrid from '@/components/talent/TalentGrid';
import TalentSearch from '@/components/talent/TalentSearch';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { getAccountBalance, getTransactionCount, getLatestTransactions } from '@/api/services/etherscanService';
import { fetchAllEnsDomains } from '@/api/services/ensService';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { toast } from 'sonner';

const Talent = () => {
  const [addressSearch, setAddressSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlockchainPassport[]>([]);
  
  // Search specific address or ENS
  const { data: ensDataByAddress } = useEnsByAddress(addressSearch);
  const { data: addressDataByEns } = useAddressByEns(
    addressSearch.includes('.eth') || addressSearch.includes('.box') ? addressSearch : undefined
  );
  
  // Get avatar for searched ENS
  const { data: avatarData } = useRealAvatar(
    addressSearch.includes('.eth') || addressSearch.includes('.box') ? addressSearch : undefined
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
        // If ENS name is provided, try to resolve address
        if (addressSearch.includes('.eth') || addressSearch.includes('.box')) {
          if (addressDataByEns) {
            address = addressDataByEns.address;
            ensName = addressDataByEns.ensName;
            avatar = addressDataByEns.avatar || avatarData || '/placeholder.svg';
          } else {
            // No data found
            setIsSearching(false);
            setSearchResults([]);
            toast.error(`Could not resolve ${addressSearch} to an address`);
            return;
          }
        } 
        // If address is provided, try to resolve ENS name
        else if (ensDataByAddress) {
          ensName = ensDataByAddress.ensName;
          avatar = ensDataByAddress.avatar || '/placeholder.svg';
        }
        
        // If no ENS name, use a placeholder
        if (!ensName) {
          ensName = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        
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
        if (ensName.includes('.eth') || ensName.includes('.box')) skills.push('ENS Owner');
        
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
          name: ensName.split('.')[0],
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
        console.error('Error fetching Etherscan data:', error);
        toast.error('Error searching for talent profile');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchEtherscanData();
  }, [addressSearch, addressDataByEns, ensDataByAddress, avatarData]);

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
