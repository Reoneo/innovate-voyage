
import { useCallback } from 'react';
import { EnsResolverProps } from './types';
import { resolveEnsName, lookupEthAddress } from './operations/ensOperations';

export function useEnsResolver(props: EnsResolverProps) {
  const { 
    state, 
    setState, 
    isLoading, 
    setIsLoading, 
    error, 
    setError
  } = props;

  // Helper function to update state
  const updateState = useCallback((newData: Partial<typeof state>) => {
    setState(prev => ({
      ...prev,
      ...newData
    }));
  }, [setState]);

  // Resolve ENS name to address
  const resolveEns = useCallback(async (ensName: string) => {
    return resolveEnsName(ensName, setIsLoading, setError, updateState);
  }, [setIsLoading, setError, updateState]);

  // Lookup address to ENS name
  const lookupAddress = useCallback(async (address: string) => {
    return lookupEthAddress(address, setIsLoading, setError, updateState);
  }, [setIsLoading, setError, updateState]);

  return {
    resolveEns,
    lookupAddress
  };
}
