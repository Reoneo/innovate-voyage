
import { useState, useEffect } from 'react';

interface BlockchainActivityData {
  firstTransaction: string | null;
  ethBalance: string | null;
  outgoingTransactions: number | null;
  hasBuilderScore: boolean;
}

export function useBlockchainActivity(walletAddress: string) {
  const [data, setData] = useState<BlockchainActivityData>({
    firstTransaction: null,
    ethBalance: null,
    outgoingTransactions: null,
    hasBuilderScore: false
  });
  const [loading, setLoading] = useState(true);
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    if (!walletAddress) {
      console.log('No wallet address provided to useBlockchainActivity');
      setLoading(false);
      setHasData(false);
      return;
    }

    console.log('Starting blockchain activity fetch for:', walletAddress);

    const fetchBlockchainActivity = async () => {
      setLoading(true);
      
      try {
        // First, try to fetch from Talent Protocol
        console.log('Trying Talent Protocol API...');
        const talentResponse = await fetch(
          `https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`,
          {
            headers: {
              "X-API-KEY": "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f",
            },
          }
        );

        if (talentResponse.ok) {
          const talentData = await talentResponse.json();
          console.log('Talent Protocol response:', talentData);
          
          if (talentData.score?.points) {
            console.log('User has builder score, using Talent Protocol data');
            // User has builder score, try to get onchain activity from Talent Protocol
            const activityData = {
              firstTransaction: talentData.first_transaction || null,
              ethBalance: talentData.eth_balance || null,
              outgoingTransactions: talentData.outgoing_transactions || null,
              hasBuilderScore: true
            };
            
            setData(activityData);
            setHasData(true);
            setLoading(false);
            console.log('Set Talent Protocol data:', activityData);
            return;
          }
        }

        // Fallback to Etherscan if no Talent Protocol data
        console.log('No Talent Protocol data, falling back to Etherscan...');
        
        const etherscanApiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
        
        // Fetch balance and transactions in parallel
        const [balanceResponse, txResponse] = await Promise.all([
          fetch(`https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`),
          fetch(`https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${etherscanApiKey}`)
        ]);

        const [balanceData, txData] = await Promise.all([
          balanceResponse.json(),
          txResponse.json()
        ]);

        console.log('Etherscan balance response:', balanceData);
        console.log('Etherscan tx response:', txData);

        let firstTx = null;
        let outgoingTxCount = 0;
        let ethBalance = null;

        // Process balance
        if (balanceData.status === '1') {
          const balanceInWei = balanceData.result;
          const balanceInEther = parseFloat(balanceInWei) / 1e18;
          ethBalance = balanceInEther.toFixed(4);
          console.log('Processed ETH balance:', ethBalance);
        }

        // Process transactions
        if (txData.status === '1' && Array.isArray(txData.result) && txData.result.length > 0) {
          const transactions = txData.result;
          console.log('Processing', transactions.length, 'transactions');
          
          // Get first transaction
          const firstTransaction = transactions[0];
          if (firstTransaction) {
            const date = new Date(parseInt(firstTransaction.timeStamp) * 1000);
            firstTx = date.toLocaleDateString();
            console.log('First transaction date:', firstTx);
          }

          // Count outgoing transactions
          outgoingTxCount = transactions.filter(tx => 
            tx.from.toLowerCase() === walletAddress.toLowerCase()
          ).length;
          console.log('Outgoing transactions count:', outgoingTxCount);
        }

        // Set data if we have any meaningful information
        const activityData = {
          firstTransaction: firstTx,
          ethBalance: ethBalance,
          outgoingTransactions: outgoingTxCount,
          hasBuilderScore: false
        };

        console.log('Final activity data:', activityData);

        // Show section if we have any data
        const hasAnyData = firstTx || ethBalance || outgoingTxCount > 0;
        console.log('Has any data:', hasAnyData);

        setData(activityData);
        setHasData(hasAnyData);

      } catch (error) {
        console.error('Error fetching blockchain activity:', error);
        setHasData(false);
      } finally {
        setLoading(false);
        console.log('Blockchain activity fetch completed');
      }
    };

    fetchBlockchainActivity();
  }, [walletAddress]);

  console.log('useBlockchainActivity hook state:', { data, loading, hasData, walletAddress });

  return { data, loading, hasData };
}
