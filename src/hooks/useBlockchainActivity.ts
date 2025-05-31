
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
        // Only use Etherscan API
        console.log('Fetching data from Etherscan...');
        
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

        // Show section if we have any data (more permissive logic)
        const hasAnyData = firstTx || ethBalance !== null || outgoingTxCount >= 0;
        console.log('Has any data check:', {
          firstTx: !!firstTx,
          hasEthBalance: ethBalance !== null,
          hasOutgoingTx: outgoingTxCount >= 0,
          hasAnyData
        });

        setData(activityData);
        setHasData(hasAnyData);

      } catch (error) {
        console.error('Error fetching blockchain activity:', error);
        // Still show the section even on error, with empty data
        setHasData(true);
      } finally {
        setLoading(false);
        console.log('Blockchain activity fetch completed');
      }
    };

    fetchBlockchainActivity();
  }, [walletAddress]);

  console.log('useBlockchainActivity hook final state:', { data, loading, hasData, walletAddress });

  return { data, loading, hasData };
}
