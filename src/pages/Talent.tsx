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

const Talent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');
  const [addressSearch, setAddressSearch] = useState('');
  const [searchMode, setSearchMode] = useState<'all' | 'specific'>('all');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<BlockchainPassport[]>([]);
  const [allProfiles, setAllProfiles] = useState<BlockchainPassport[]>([]);
  
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
      
      try {
        // If ENS name is provided, try to resolve address
        if (addressSearch.includes('.eth')) {
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
        if (ensName.includes('.eth')) skills.push('ENS Owner');
        
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
          avatar_url: avatar, // Use resolved avatar
          name: ensName.split('.')[0],
          issued: new Date().toISOString(),
          skills: skills.map(skill => ({
            name: skill,
            proof: `etherscan://${address}`,
          })),
          socials: {}
        };
        
        setSearchResults([newPassport]);
        toast({
          title: "Profile found!",
          description: `Found blockchain data for ${ensName}`,
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

  // Generate dynamic profiles on component mount
  useEffect(() => {
    const generateDynamicProfiles = async () => {
      setIsSearching(true);
      
      try {
        // Generate some example wallet addresses
        const exampleAddresses = [
          '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          '0x2B5AD5c4795c026514f8317c7a215E218DcCD6cF',
          '0x9C4eb242AcEbc6bfC068Ca16B8c851920Dd7BF11',
          '0x99C85bb64564D9eF9A99621301f22C9993Cb4E3F',
          '0x983110309620D911731Ac0932219af06091b6744'
        ];
        
        const generatedProfiles: BlockchainPassport[] = [];
        
        for (const address of exampleAddresses) {
          try {
            // For each address, generate a profile with blockchain data
            const [balance, txCount, latestTxs] = await Promise.all([
              getAccountBalance(address),
              getTransactionCount(address),
              getLatestTransactions(address, 3)
            ]);
            
            // Create a display name from the address
            const displayName = `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
            
            // Generate skills based on blockchain data
            const skills = [];
            if (Number(balance) > 0) skills.push('ETH Holder');
            if (txCount > 10) skills.push('Active Trader');
            if (txCount > 50) skills.push('Power User');
            
            // Add relevant skills based on transaction history
            if (latestTxs && latestTxs.length > 0) {
              const hasContractInteractions = latestTxs.some(tx => tx.input && tx.input !== '0x');
              if (hasContractInteractions) skills.push('Smart Contract User');
              
              const recentTx = latestTxs.some(tx => {
                const txDate = new Date(parseInt(tx.timeStamp) * 1000);
                const now = new Date();
                const daysDiff = (now.getTime() - txDate.getTime()) / (1000 * 3600 * 24);
                return daysDiff < 30;
              });
              
              if (recentTx) skills.push('Recently Active');
            }
            
            // Add some random additional skills
            const additionalSkills = [
              'DeFi Explorer', 
              'NFT Creator', 
              'DAO Governor', 
              'Blockchain Developer',
              'Web3 Enthusiast',
              'Crypto Investor',
              'Tokenomics Expert'
            ];
            
            // Add 1-3 random skills
            const numAdditionalSkills = Math.floor(Math.random() * 3) + 1;
            for (let i = 0; i < numAdditionalSkills; i++) {
              const randomSkill = additionalSkills[Math.floor(Math.random() * additionalSkills.length)];
              if (!skills.includes(randomSkill)) {
                skills.push(randomSkill);
              }
            }
            
            // Create the passport
            const passport: BlockchainPassport = {
              passport_id: displayName,
              owner_address: address,
              avatar_url: '/placeholder.svg', // Default avatar
              name: displayName.split('.')[0],
              issued: new Date(Date.now() - Math.random() * 63072000000).toISOString(),
              skills: skills.map(skill => ({
                name: skill,
                proof: `etherscan://${address}`,
              })),
              socials: {}
            };
            
            generatedProfiles.push(passport);
          } catch (error) {
            console.error(`Error generating profile for ${address}:`, error);
          }
        }
        
        setAllProfiles(generatedProfiles);
      } catch (error) {
        console.error('Error generating dynamic profiles:', error);
        toast({
          title: "Error",
          description: "Could not generate profiles. Please try again.",
          variant: "destructive"
        });
      } finally {
        setIsSearching(false);
      }
    };
    
    generateDynamicProfiles();
  }, []);

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
    
    // Otherwise use the dynamically generated profiles
    if (allProfiles.length === 0) return [];
    
    // Create full passport objects with scores
    const passports = allProfiles.map(passport => {
      const { score, category } = calculateHumanScore(passport);
      
      return {
        ...passport,
        score,
        category,
        colorClass: getScoreColorClass(score),
        hasMoreSkills: passport.skills.length > 4
      };
    });

    // Apply filters
    return passports
      .filter(passport => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            passport.passport_id.toLowerCase().includes(searchLower) ||
            passport.owner_address.toLowerCase().includes(searchLower) ||
            passport.skills.some(skill => skill.name.toLowerCase().includes(searchLower));
          
          if (!matchesSearch) return false;
        }
        
        // Skills filter
        if (selectedSkills.length > 0) {
          const hasSelectedSkills = selectedSkills.some(skill => 
            passport.skills.some(s => s.name === skill)
          );
          
          if (!hasSelectedSkills) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === 'score') {
          return b.score - a.score;
        } else if (sortBy === 'name') {
          return a.passport_id.localeCompare(b.passport_id);
        } else {
          return b.score - a.score; // Default
        }
      });
  }, [allProfiles, searchTerm, selectedSkills, sortBy, searchMode, searchResults]);

  // Calculate total transactions
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  useEffect(() => {
    if (passportData.length > 0) {
      // Take the first 5 profiles to avoid too many API calls
      const sampleAddresses = passportData.slice(0, 5).map(p => p.owner_address);
      
      // Count total transactions from these sample addresses
      let txCount = 0;
      
      const fetchTransactionCounts = async () => {
        for (const address of sampleAddresses) {
          try {
            const count = await getTransactionCount(address);
            txCount += count;
          } catch (error) {
            console.error('Error fetching transaction count:', error);
          }
        }
        
        setTotalTransactions(txCount);
      };
      
      fetchTransactionCounts();
    }
  }, [passportData]);

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
    setSearchMode('all');
    setSearchResults([]);
  };

  // Extract all unique skills for filters
  const allSkills = useMemo(() => {
    if (allProfiles.length === 0 && searchResults.length === 0) return [];
    
    const skillsSet = new Set<string>();
    
    // Add skills from all profiles
    allProfiles.forEach(profile => {
      profile.skills?.forEach(skill => skillsSet.add(skill.name));
    });
    
    // Add skills from search results
    searchResults.forEach(passport => {
      passport.skills?.forEach(skill => skillsSet.add(skill.name));
    });
    
    return Array.from(skillsSet).sort();
  }, [allProfiles, searchResults]);

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
        
        <Tabs value={searchMode} onValueChange={(v) => setSearchMode(v as 'all' | 'specific')} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="all">All Talent</TabsTrigger>
            <TabsTrigger value="specific">Search Results</TabsTrigger>
          </TabsList>
        </Tabs>
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
