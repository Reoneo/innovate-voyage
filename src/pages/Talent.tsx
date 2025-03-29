import React, { useState, useMemo, useEffect } from 'react';
import { useAllEnsRecords, useAllSkillNfts, useEnsByAddress, useAddressByEns } from '@/hooks/useWeb3';
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

  const { data: ensRecords, isLoading: isLoadingEns } = useAllEnsRecords();
  const { data: skillNfts, isLoading: isLoadingNfts } = useAllSkillNfts();
  
  const { data: ensDataByAddress } = useEnsByAddress(searchMode === 'specific' ? addressSearch : undefined);
  const { data: addressDataByEns } = useAddressByEns(
    searchMode === 'specific' && addressSearch.includes('.eth') ? addressSearch : undefined
  );

  useEffect(() => {
    const fetchEtherscanData = async () => {
      if (searchMode !== 'specific' || !addressSearch) return;
      
      setIsSearching(true);
      let address = addressSearch;
      let ensName = '';
      
      try {
        if (addressSearch.includes('.eth') || addressSearch.includes('.box')) {
          if (addressDataByEns) {
            address = addressDataByEns.address;
            ensName = addressDataByEns.ensName;
          } else {
            return;
          }
        } 
        else if (ensDataByAddress) {
          ensName = ensDataByAddress.ensName;
        }
        
        if (!ensName) {
          ensName = address.substring(0, 6) + '...' + address.substring(address.length - 4);
        }
        
        const [balance, txCount, latestTxs] = await Promise.all([
          getAccountBalance(address),
          getTransactionCount(address),
          getLatestTransactions(address, 5)
        ]);
        
        const skills = [];
        if (Number(balance) > 0) skills.push('ETH Holder');
        if (txCount > 10) skills.push('Active Trader');
        if (txCount > 50) skills.push('Power User');
        if (ensName.includes('.eth')) skills.push('ENS Owner');
        if (ensName.includes('.box')) skills.push('.box Domain Owner');
        
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
        
        const newPassport: BlockchainPassport = {
          passport_id: ensName,
          owner_address: address,
          avatar_url: '/placeholder.svg',
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
  }, [addressSearch, searchMode, addressDataByEns, ensDataByAddress]);

  const passportData = useMemo(() => {
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
    
    if (!ensRecords) return [];
    
    const passports = ensRecords.map(record => {
      const passport: BlockchainPassport = {
        passport_id: record.ensName,
        owner_address: record.address,
        avatar_url: record.avatar,
        name: record.ensName.split('.')[0],
        issued: new Date(Date.now() - Math.random() * 63072000000).toISOString(),
        socials: record.socialProfiles,
        skills: record.skills.map(skill => ({
          name: skill,
          proof: Math.random() > 0.5 ? `ipfs://QmProof${skill.replace(/\s/g, '')}` : undefined,
          issued_by: Math.random() > 0.7 ? ['Ethereum Foundation', 'Encode Club', 'Consensys', 'ETHGlobal'][Math.floor(Math.random() * 4)] : undefined
        }))
      };

      const { score, category } = calculateHumanScore(passport);
      
      return {
        ...passport,
        score,
        category,
        colorClass: getScoreColorClass(score),
        hasMoreSkills: passport.skills.length > 4
      };
    });

    return passports
      .filter(passport => {
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            passport.passport_id.toLowerCase().includes(searchLower) ||
            passport.owner_address.toLowerCase().includes(searchLower) ||
            passport.skills.some(skill => skill.name.toLowerCase().includes(searchLower));
          
          if (!matchesSearch) return false;
        }
        
        if (selectedSkills.length > 0) {
          const hasSelectedSkills = selectedSkills.some(skill => 
            passport.skills.some(s => s.name === skill)
          );
          
          if (!hasSelectedSkills) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'score') {
          return b.score - a.score;
        } else if (sortBy === 'name') {
          return a.passport_id.localeCompare(b.passport_id);
        } else {
          return b.score - a.score; // Default
        }
      });
  }, [ensRecords, searchTerm, selectedSkills, sortBy, searchMode, searchResults]);

  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  useEffect(() => {
    if (passportData.length > 0) {
      const sampleAddresses = passportData.slice(0, 5).map(p => p.owner_address);
      
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

  const allSkills = useMemo(() => {
    if (!ensRecords) return [];
    
    const skillsSet = new Set<string>();
    
    ensRecords.forEach(record => {
      record.skills.forEach(skill => skillsSet.add(skill));
    });
    
    searchResults.forEach(passport => {
      passport.skills?.forEach(skill => skillsSet.add(skill.name));
    });
    
    return Array.from(skillsSet).sort();
  }, [ensRecords, searchResults]);

  return (
    <TalentLayout 
      profileCount={passportData.length}
      transactionCount={totalTransactions}
    >
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

      <div className="lg:col-span-3">
        <TalentGrid
          isLoading={isLoadingEns || isSearching}
          passportData={passportData}
          clearFilters={clearFilters}
        />
      </div>
    </TalentLayout>
  );
};

export default Talent;
