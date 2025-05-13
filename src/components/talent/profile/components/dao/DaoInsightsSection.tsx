
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatEther } from 'ethers';
import { Skeleton } from '@/components/ui/skeleton';
import { useTallyData } from '@/hooks/useTallyData';

interface DaoInsightsSectionProps {
  walletAddress?: string;
}

const formatNumber = (num: number) => {
  if (num >= 1000000) {
    return `${(num / 1000000).toFixed(1)}M`;
  } else if (num >= 1000) {
    return `${(num / 1000).toFixed(1)}K`;
  } else {
    return num.toString();
  }
};

const DaoInsightsSection: React.FC<DaoInsightsSectionProps> = ({ walletAddress }) => {
  const { loading, error, data } = useTallyData(walletAddress);
  const [daoSummary, setDaoSummary] = useState({
    totalVotes: 0,
    uniqueDaos: 0,
    topDao: '',
    totalVotingPower: '0'
  });

  useEffect(() => {
    if (!data || !data.wallet) return;
    
    try {
      // Process governor data from Tally API
      const governors = data.wallet.governors || [];
      
      // Calculate unique DAOs by counting unique governor addresses
      const uniqueGovernorAddresses = new Set(governors.map(gov => gov.id));
      const uniqueDaosCount = uniqueGovernorAddresses.size;
      
      // Calculate total votes across all DAOs
      let totalVotesCount = 0;
      governors.forEach(governor => {
        if (governor.voterInfo && governor.voterInfo.proposals) {
          totalVotesCount += governor.voterInfo.proposals.length;
        }
      });
      
      // Find the DAO with the most votes
      let topDaoName = '';
      let maxVotes = 0;
      governors.forEach(governor => {
        const votesCount = (governor.voterInfo && governor.voterInfo.proposals) 
          ? governor.voterInfo.proposals.length 
          : 0;
        
        if (votesCount > maxVotes) {
          maxVotes = votesCount;
          topDaoName = governor.name || 'Unknown DAO';
        }
      });
      
      // Calculate total voting power
      let totalPower = 0;
      governors.forEach(governor => {
        if (governor.voterInfo && governor.voterInfo.votingPower) {
          // Convert from wei to ether if needed and sum
          try {
            // Use formatEther from ethers v6
            const powerInEther = Number(formatEther(BigInt(governor.voterInfo.votingPower)));
            totalPower += powerInEther;
          } catch (err) {
            console.error('Error converting voting power:', err);
          }
        }
      });
      
      setDaoSummary({
        totalVotes: totalVotesCount,
        uniqueDaos: uniqueDaosCount,
        topDao: topDaoName,
        totalVotingPower: totalPower.toFixed(2)
      });
      
    } catch (err) {
      console.error('Error processing DAO data:', err);
    }
  }, [data]);

  return (
    <Card className="border-0 shadow-sm mb-4">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-semibold flex items-center">
          <span>DAO Governance Insights</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-20 w-full" />
          </div>
        ) : error ? (
          <div className="text-center p-4 text-muted-foreground">
            Could not load DAO activity
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <StatCard 
              title="Total Votes" 
              value={formatNumber(daoSummary.totalVotes)}
              description="Governance votes" 
            />
            <StatCard 
              title="Active DAOs" 
              value={daoSummary.uniqueDaos.toString()}
              description="Participated in" 
            />
            <StatCard 
              title="Top DAO" 
              value={daoSummary.topDao}
              description="Most active in" 
            />
            <StatCard 
              title="Voting Power" 
              value={daoSummary.totalVotingPower}
              description="Total across DAOs" 
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
};

interface StatCardProps {
  title: string;
  value: string;
  description: string;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description }) => {
  return (
    <div className="stat-card p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
      <h4 className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</h4>
      <p className="text-xl font-bold truncate" title={value}>
        {value}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
    </div>
  );
};

export default DaoInsightsSection;
