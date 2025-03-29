
import { useState, useEffect } from 'react';
import { getAddressByEns, getEnsByAddress, getRealAvatar } from '@/api/services/ensService';
import { isValidEthereumAddress } from '@/lib/utils';

/**
 * Hook for resolving ENS names to addresses and vice versa
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [resolvedEns, setResolvedEns] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    setIsLoading(true);
    setError(null);

    const resolveIdentifier = async () => {
      try {
        if (ensName) {
          console.log(`Resolving ${ensName.includes('.box') ? '.box domain' : '.eth domain'}: ${ensName} using ${ensName.includes('.box') ? 'Optimism network' : 'Mainnet provider'}`);
          const result = await getAddressByEns(ensName);
          if (!result) {
            if (isMounted) {
              setError(`Could not resolve ${ensName}`);
              setIsLoading(false);
            }
            return;
          }

          if (isMounted) {
            setResolvedAddress(result.address);
            setResolvedEns(result.ensName);
            setAvatarUrl(result.avatar || null);
          }
        } else if (address && isValidEthereumAddress(address)) {
          const result = await getEnsByAddress(address);
          if (!result) {
            if (isMounted) {
              // Don't set an error here, just don't show resolved data
              setIsLoading(false);
            }
            return;
          }

          if (isMounted) {
            setResolvedAddress(result.address);
            setResolvedEns(result.ensName);
            setAvatarUrl(result.avatar || null);
          }
        }
      } catch (err) {
        if (isMounted) {
          // Convert error to a more user-friendly message
          const errorMessage = err instanceof Error 
            ? "Unable to resolve name. Please try again later."
            : "An unknown error occurred";
          setError(errorMessage);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    if (ensName || address) {
      resolveIdentifier();
    } else {
      setIsLoading(false);
      setResolvedAddress(null);
      setResolvedEns(null);
      setAvatarUrl(null);
    }

    return () => {
      isMounted = false;
    };
  }, [ensName, address]);

  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    isLoading,
    error
  };
}
