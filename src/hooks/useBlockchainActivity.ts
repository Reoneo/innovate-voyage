
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
      setLoading(false);
      return;
    }

    const fetchBlockchainActivity = async () => {
      setLoading(true);
      
      try {
        // First, try to fetch from Talent Protocol
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
          console.log('Talent Protocol data:', talentData);
          
          if (talentData.score?.points) {
            // User has builder score, try to get onchain activity from Talent Protocol
            setData({
              firstTransaction: talentData.first_transaction || null,
              ethBalance: talentData.eth_balance || null,
              outgoingTransactions: talentData.outgoing_transactions || null,
              hasBuilderScore: true
            });
            setHasData(true);
            setLoading(false);
            return;
          }
        }

        // Fallback to Etherscan if no Talent Protocol data
        console.log('Falling back to Etherscan for blockchain activity');
        
        const etherscanApiKey = "5NNYEUKQQPJ82NZW9BX7Q1X1HICVRDKNPM";
        
        // Fetch balance
        const balanceResponse = await fetch(
          `https://api.etherscan.io/api?module=account&action=balance&address=${walletAddress}&tag=latest&apikey=${etherscanApiKey}`
        );
        
        // Fetch transactions
        const txResponse = await fetch(
          `https://api.etherscan.io/api?module=account&action=txlist&address=${walletAddress}&startblock=0&endblock=99999999&page=1&offset=1000&sort=asc&apikey=${etherscanApiKey}`
        );

        const [balanceData, txData] = await Promise.all([
          balanceResponse.json(),
          txResponse.json()
        ]);

        let firstTx = null;
        let outgoingTxCount = 0;
        let ethBalance = null;

        // Process balance
        if (balanceData.status === '1') {
          const balanceInWei = balanceData.result;
          const balanceInEther = parseFloat(balanceInWei) / 1e18;
          ethBalance = balanceInEther.toFixed(4);
        }

        // Process transactions
        if (txData.status === '1' && Array.isArray(txData.result) && txData.result.length > 0) {
          const transactions = txData.result;
          
          // Get first transaction
          const firstTransaction = transactions[0];
          if (firstTransaction) {
            const date = new Date(parseInt(firstTransaction.timeStamp) * 1000);
            firstTx = date.toLocaleDateString();
          }

          // Count outgoing transactions
          outgoingTxCount = transactions.filter(tx => 
            tx.from.toLowerCase() === walletAddress.toLowerCase()
          ).length;
        }

        // Only show section if we have some data
        if (firstTx || ethBalance || outgoingTxCount > 0) {
          setData({
            firstTransaction: firstTx,
            ethBalance: ethBalance,
            outgoingTransactions: outgoingTxCount,
            hasBuilderScore: false
          });
          setHasData(true);
        } else {
          setHasData(false);
        }

      } catch (error) {
        console.error('Error fetching blockchain activity:', error);
        setHasData(false);
      } finally {
        setLoading(false);
      }
    };

    fetchBlockchainActivity();
  }, [walletAddress]);

  return { data, loading, hasData };
}
