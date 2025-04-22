
import React, { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import TalentScoreBadge from './scores/TalentScoreBadge';
import SecurityScoreBadge from './scores/SecurityScoreBadge';
import TransactionsBadge from './scores/TransactionsBadge';
import ScoreDialog from './scores/ScoreDialog';
import { getThreatLevel } from './scores/utils/scoreUtils';
import type { WebacyData } from './scores/types';

interface TalentScoreBannerProps {
  walletAddress: string;
}

const TalentScoreBanner: React.FC<TalentScoreBannerProps> = ({ walletAddress }) => {
  const [score, setScore] = useState<number | null>(null);
  const [webacyData, setWebacyData] = useState<WebacyData | null>(null);
  const [txCount, setTxCount] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<'talent' | 'webacy' | 'transactions'>('talent');
  const { toast } = useToast();

  useEffect(() => {
    if (!walletAddress) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch Talent Protocol Score
        const talentResp = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
          }
        );
        
        if (talentResp.ok) {
          const data = await talentResp.json();
          setScore(data.score?.points ?? null);
        }

        // Fetch Webacy Data
        const [addressData, approvalsData, quickProfileData] = await Promise.all([
          fetch(`https://api.webacy.com/addresses/${walletAddress}`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json()),
          fetch(`https://api.webacy.com/addresses/${walletAddress}/approvals`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json()),
          fetch(`https://api.webacy.com/quick-profile/${walletAddress}`, {
            headers: {
              'X-API-KEY': 'e2FUxEsqYHvUWFUDbJiL5e3kLhotB0la9L6enTgb',
              'Key-ID': 'eujjkt9ao5'
            }
          }).then(r => r.json())
        ]);

        // Fetch Transaction Count from Etherscan
        const etherscanResp = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=desc&apikey=5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM`
        );
        
        if (etherscanResp.ok) {
          const data = await etherscanResp.json();
          if (data.status === '1') {
            setTxCount(data.result.length);
          }
        }

        setWebacyData({
          riskScore: addressData.riskScore,
          threatLevel: getThreatLevel(addressData.riskScore),
          approvals: {
            count: approvalsData.totalCount || 0,
            riskyCount: approvalsData.riskyCount || 0
          },
          quickProfile: {
            transactions: quickProfileData.numTransactions,
            contracts: quickProfileData.numContracts,
            riskLevel: quickProfileData.riskLevel
          }
        });

      } catch (error) {
        console.error('Error fetching data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch score data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [walletAddress, toast]);

  const handleBadgeClick = (type: 'talent' | 'webacy' | 'transactions') => {
    setActiveDialog(type);
    setDialogOpen(true);
  };

  if (!walletAddress) return null;

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <TalentScoreBadge 
          score={score} 
          onClick={() => handleBadgeClick('talent')}
          isLoading={loading} 
        />
        <SecurityScoreBadge 
          webacyData={webacyData} 
          onClick={() => handleBadgeClick('webacy')}
          isLoading={loading} 
        />
        <TransactionsBadge 
          txCount={txCount} 
          onClick={() => handleBadgeClick('transactions')}
          isLoading={loading} 
        />
      </div>

      <ScoreDialog 
        open={dialogOpen} 
        onOpenChange={setDialogOpen}
        type={activeDialog}
        data={{
          score,
          webacyData,
          txCount,
          walletAddress
        }}
      />
    </>
  );
};

export default TalentScoreBanner;
