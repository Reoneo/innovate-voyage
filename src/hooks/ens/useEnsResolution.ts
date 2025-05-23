
import { useEffect } from 'react';
import { useEnsState } from './useEnsState';
import { useAddressResolution } from './useAddressResolution';
import { useNameResolution } from './useNameResolution';
import { EnsResolutionResult } from './types';

/**
 * A hook for ENS name <-> address resolution with metadata
 * Provides efficient parallel data fetching and caching
 */
export function useEnsResolution(ensName?: string, address?: string): EnsResolutionResult {
  const {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    abortController,
    setAbortController,
    resetState,
    updateState
  } = useEnsState();

  const { resolveAddress } = useAddressResolution();
  const { resolveName } = useNameResolution();

  // Cleanup function for any ongoing requests
  useEffect(() => {
    return () => {
      if (abortController) {
        abortController.abort();
      }
    };
  }, [abortController]);

  // Function to resolve ENS name to address with improved caching and parallel fetching
  const resolveEns = async (ensName: string) => {
    await resolveName(ensName, {
      setState,
      setIsLoading,
      setError,
      abortController,
      setAbortController,
      resetState
    });
  };

  // Function to lookup address to ENS with improved caching and parallel fetching
  const lookupAddress = async (address: string) => {
    await resolveAddress(address, {
      setState,
      setIsLoading,
      setError,
      abortController,
      setAbortController,
      resetState
    });
  };

  return {
    state,
    setState,
    isLoading,
    error,
    resolveEns,
    lookupAddress
  };
}
