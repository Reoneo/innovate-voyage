
import { useEffect } from 'react';

export function useRetryLogic({
  error,
  retryCount,
  setRetryCount,
  maxRetries,
  isEnsName,
  ensName,
  resolveEns,
  isValidAddress,
  address,
  lookupAddress
}: {
  error: string | null;
  retryCount: number;
  setRetryCount: (count: number) => void;
  maxRetries: number;
  isEnsName: boolean;
  ensName?: string;
  resolveEns: (name: string) => Promise<void>;
  isValidAddress: boolean;
  address?: string;
  lookupAddress: (addr: string) => Promise<void>;
}) {
  useEffect(() => {
    if (error && retryCount < maxRetries) {
      const timer = setTimeout(() => {
        console.log(`Retrying ENS resolution (${retryCount + 1})`);
        setRetryCount(retryCount + 1);
        
        if (isEnsName && ensName) {
          resolveEns(ensName);
        } else if (isValidAddress && address) {
          lookupAddress(address);
        }
      }, 1500);
      
      return () => clearTimeout(timer);
    }
  }, [error, retryCount, maxRetries, isEnsName, ensName, resolveEns, isValidAddress, address, lookupAddress, setRetryCount]);
}
