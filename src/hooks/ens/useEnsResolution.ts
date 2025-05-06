
import { useState, useCallback } from 'react';
import { useEnsResolver } from './useEnsResolverCore';
import { useRetryLogic } from './useEnsRetryLogic';
import { EnsResolutionState } from './types';

export function useEnsResolution(ensName?: string, address?: string) {
  // Initialize the base state
  const [state, setState] = useState<EnsResolutionState>({
    resolvedAddress: address,
    resolvedEns: ensName,
    avatarUrl: undefined,
    ensBio: undefined,
    ensLinks: {
      socials: {},
      ensLinks: [],
      keywords: []
    }
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Maximum number of retry attempts
  const MAX_RETRIES = 2;

  // Use the core resolver functionality with retry logic
  const { resolveEns, lookupAddress } = useEnsResolver({
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryCount,
    setRetryCount,
    maxRetries: MAX_RETRIES
  });

  return {
    state,
    setState,
    isLoading,
    setIsLoading,
    error,
    setError,
    retryCount,
    resolveEns,
    lookupAddress
  };
}
