
import React, { useState, useMemo, useEffect } from 'react';
import { useEnsByAddress, useAddressByEns, useRealAvatar } from '@/hooks/useWeb3';
import { calculateHumanScore, getScoreColorClass, BlockchainPassport } from '@/lib/utils';
import TalentLayout from '@/components/talent/TalentLayout';
import TalentFilters from '@/components/talent/TalentFilters';
import TalentGrid from '@/components/talent/TalentGrid';
import TalentSearch from '@/components/talent/TalentSearch';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from '@/components/ui/use-toast';
import { getAccountBalance, getTransactionCount, getLatestTransactions } from '@/api/services/etherscanService';
import { fetchAllEnsDomains } from '@/api/services/ensService';

const Talent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');
  const [addressSearch, setAddressSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'specific'>('specific');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlockchainPassport[]>([]);
  
  // Search specific address or ENS
  const { data: ensDataByAddress } = useEnsByAddress(searchMode === 'specific' ? addressSearch : undefined);
  const { data: addressDataByEns } = useAddressByEns(
    searchMode === 'specific' && addressSearch.includes('.eth') ? addressSearch : undefined
  );
  
  // Get avatar for searched ENS
  const { data: avatarData } = useRealAvatar(
    searchMode === 'specific' && addressSearch.includes('.eth') ? addressSearch : undefined
  );

  // Effect to fetch data when address search changes
  useEffect(() => {
    const fetchEtherscanData = async () => {
      if (searchMode !== 'specific' || !addressSearch) return;
      
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
            // Wait for addressDataByEns to resolve
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
        
        // Fetch ALL ENS domains for this address
        const allDomains = await fetchAllEnsDomains(address);
        if (allDomains && allDomains.length > 0) {
          // Remove the primary domain that we already have
          additionalEnsDomains = allDomains.filter(domain => domain !== ensName);
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
          additionalEnsDomains // Add the additional domains
        };
        
        setSearchResults([newPassport]);
        toast({
          title: "Profile found!",
          description: `Found blockchain data for ${ensName}${additionalEnsDomains.length > 0 ? ` and ${additionalEnsDomains.length} additional ENS domains` : ''}`,
        });
      } catch (error) {
        console.error('Error fetching Etherscan data:', error);
        toast({
          title: "Error",
          description: "Could not fetch blockchain data. Please try again.",
          variant: "destructive"
        });
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    };
    
    fetchEtherscanData();
  }, [addressSearch, searchMode, addressDataByEns, ensDataByAddress, avatarData]);

  // Calculate total transactions
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  // Process passport data and apply filters
  const passportData = useMemo(() => {
    // If we're in specific search mode, use the search results
    if (searchMode === 'specific' && searchResults.length > 0) {
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
    
    // No default profiles, return empty array
    return [];
  }, [searchResults, searchMode]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
  };

  const handleAddressSearch = (input: string) => {
    setAddressSearch(input);
    setSearchMode('specific');
  };

  const handleViewAll = () => {
    setAddressSearch('');
    setSearchTerm('');
    setSearchMode('specific');
    setSearchResults([]);
  };

  // Extract all unique skills for filters
  const allSkills = useMemo(() => {
    if (searchResults.length === 0) return [];
    
    const skillsSet = new Set<string>();
    
    // Add skills from search results
    searchResults.forEach(passport => {
      passport.skills?.forEach(skill => skillsSet.add(skill.name));
    });
    
    return Array.from(skillsSet).sort();
  }, [searchResults]);

  return (
    <TalentLayout 
      profileCount={passportData.length}
      transactionCount={totalTransactions}
    >
      {/* Search & Tabs */}
      <div className="lg:col-span-4 mb-6">
        <TalentSearch 
          onSearch={handleAddressSearch} 
          onViewAll={handleViewAll} 
          isSearching={isSearching}
        />
      </div>
      
      {/* Filters Sidebar */}
      <div className="lg:col-span-1">
        <TalentFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedSkills={selectedSkills}
          handleSkillToggle={handleSkillToggle}
          sortBy={sortBy}
          setSortBy={setSortBy}
          clearFilters={clearFilters}
          allSkills={allSkills}
        />
      </div>

      {/* Talent Grid */}
      <div className="lg:col-span-3">
        <TalentGrid
          isLoading={isSearching}
          passportData={passportData}
          clearFilters={clearFilters}
        />
      </div>
    </TalentLayout>
  );
};

export default Talent;
