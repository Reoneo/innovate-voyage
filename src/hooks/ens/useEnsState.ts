
import { useState, useCallback } from 'react';
import { EnsResolutionState } from './types';

/**
 * Core hook for managing ENS resolution state
 */
export function useEnsState() {
  const [state, setState] = useState<EnsResolutionState>({
    resolvedAddress: undefined,
    resolvedEns: undefined,
    avatarUrl: undefined,
    ensBio: undefined,
    ensLinks: {
      socials: {},
      ensLinks: [],
      keywords: []
    },
    textRecords: {}
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  const resetState = useCallback(() => {
    setError(null);
    if (abortController) {
      abortController.abort();
      setAbortController(null);
    }
  }, [abortController]);

  const updateState = useCallback((updates: Partial<EnsResolutionState>) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  return {
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
  };
}
