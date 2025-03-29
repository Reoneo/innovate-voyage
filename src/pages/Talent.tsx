
import React, { useState, useMemo } from 'react';
import { useAllEnsRecords, useAllSkillNfts } from '@/hooks/useWeb3';
import { calculateHumanScore, getScoreColorClass, BlockchainPassport } from '@/lib/utils';
import TalentLayout from '@/components/talent/TalentLayout';
import TalentFilters from '@/components/talent/TalentFilters';
import TalentGrid from '@/components/talent/TalentGrid';
import { useBlockchainProfile } from '@/hooks/useEtherscan';

const Talent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');

  const { data: ensRecords, isLoading: isLoadingEns } = useAllEnsRecords();
  const { data: skillNfts, isLoading: isLoadingNfts } = useAllSkillNfts();

  // Extract all unique skills from passports
  const allSkills = useMemo(() => {
    if (!ensRecords) return [];
    
    const skillsSet = new Set<string>();
    ensRecords.forEach(record => {
      record.skills.forEach(skill => skillsSet.add(skill));
    });
    
    return Array.from(skillsSet).sort();
  }, [ensRecords]);

  // Process passport data and apply filters
  const passportData = useMemo(() => {
    if (!ensRecords) return [];
    
    // Create full passport objects with scores
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
  }, [ensRecords, searchTerm, selectedSkills, sortBy]);

  // Sum up total transactions across all profiles (for those with data)
  const [totalTransactions, setTotalTransactions] = useState<number>(0);

  // Fetch blockchain data for the first few profiles to show some transaction stats
  React.useEffect(() => {
    if (passportData.length > 0) {
      // Take the first 5 profiles to avoid too many API calls
      const sampleAddresses = passportData.slice(0, 5).map(p => p.owner_address);
      
      // Count total transactions from these sample addresses
      let txCount = 0;
      
      const fetchTransactionCounts = async () => {
        for (const address of sampleAddresses) {
          try {
            const response = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_getTransactionCount&address=${address}&tag=latest&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`);
            const data = await response.json();
            
            if (data.result) {
              // Convert hex to decimal and add to total
              txCount += parseInt(data.result, 16);
            }
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

  return (
    <TalentLayout 
      profileCount={passportData.length}
      transactionCount={totalTransactions}
    >
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
          isLoading={isLoadingEns}
          passportData={passportData}
          clearFilters={clearFilters}
        />
      </div>
    </TalentLayout>
  );
};

export default Talent;
