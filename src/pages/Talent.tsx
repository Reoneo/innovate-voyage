
import React, { useState, useMemo, useEffect } from 'react';
import { useEnsByAddress, useAddressByEns, useRealAvatar } from '@/hooks/useWeb3';
import { BlockchainPassport } from '@/lib/utils';
import TalentLayout from '@/components/talent/TalentLayout';
import TalentGrid from '@/components/talent/TalentGrid';
import TalentSearch from '@/components/talent/TalentSearch';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { getAccountBalance, getTransactionCount, getLatestTransactions } from '@/api/services/etherscanService';

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
      
      try {
        // If ENS name is provided, try to resolve address
        if (addressSearch.includes('.eth') || addressSearch.includes('.box')) {
          if (addressDataByEns) {
            address = addressDataByEns.address;
            ensName = addressDataByEns.ensName;
            avatar = addressDataByEns.avatar || avatarData || '/placeholder.svg';
          } else {
            // No data found, but don't show error toast
            setIsSearching(false);
            setSearchResults([]);
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
        
        // Create new passport from Etherscan data
        const newPassport: BlockchainPassport = {
          passport_id: ensName,
          owner_address: address,
          avatar_url: avatar,
          name: ensName.split('.')[0],
          issued: new Date().toISOString(),
          skills: [],
          socials: {}
        };
        
        setSearchResults([newPassport]);
      } catch (error) {
        console.error('Error fetching Etherscan data:', error);
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
        return {
          ...passport,
          score: 0,
          category: "",
          colorClass: "",
          hasMoreSkills: false
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
