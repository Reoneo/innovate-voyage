import { useState, useEffect } from 'react';
import { resolveEns } from '@/utils/ens';
import { getAllEnsRecords } from '@/api/services/domains';
import { mainnetProvider } from '@/utils/ethereumProviders';
import { isValidEthereumAddress } from '@/lib/utils';
import { fetchAvatarUrl } from '@/api/services/avatar';

/**
 * Hook to resolve ENS names and Ethereum addresses with comprehensive error handling
 * @param ensName Optional ENS name to resolve
 * @param address Optional Ethereum address to resolve
 * @returns Object with resolved data, loading state, and error information
 */
export function useEnsResolver(ensName?: string, address?: string) {
  const [resolvedAddress, setResolvedAddress] = useState<string | null>(null);
  const [resolvedEns, setResolvedEns] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | undefined>(undefined);
  const [ensLinks, setEnsLinks] = useState<any>(null);
  const [ensBio, setEnsBio] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const resolveEnsData = async () => {
      try {
        setIsLoading(true);
        
        // Reset state for new resolution
        setError(null);
        setResolvedAddress(null);
        setResolvedEns(null);
        setAvatarUrl(undefined);
        setEnsLinks(null);
        setEnsBio(null);
        
        // Handle empty input case
        if (!ensName && !address) {
          setIsLoading(false);
          return;
        }

        // Case 1: Resolve from ENS name
        if (ensName) {
          try {
            console.log(`Resolving ENS name: ${ensName}`);
            const resolvedAddr = await resolveEns(ensName);
            
            if (resolvedAddr) {
              console.log(`ENS ${ensName} resolved to address: ${resolvedAddr}`);
              setResolvedAddress(resolvedAddr);
              setResolvedEns(ensName);
              
              // Fetch avatar for ENS
              try {
                const avatar = await fetchAvatarUrl(ensName);
                if (avatar) {
                  setAvatarUrl(avatar);
                  console.log(`Avatar found for ${ensName}: ${avatar}`);
                }
              } catch (avatarError) {
                console.warn(`Avatar fetch failed for ${ensName}:`, avatarError);
              }
              
              // Get ENS text records
              try {
                const records = await getAllEnsRecords(ensName);
                setEnsLinks(records);
                setEnsBio(records?.description || null);
                console.log(`ENS records for ${ensName}:`, records);
              } catch (recordError) {
                console.warn(`ENS records fetch failed for ${ensName}:`, recordError);
              }
            } else {
              setError(`Could not resolve ENS name ${ensName}`);
              console.error(`ENS resolution failed for ${ensName}`);
            }
          } catch (ensError) {
            console.error(`Error resolving ENS ${ensName}:`, ensError);
            setError(`Error resolving ENS: ${ensError instanceof Error ? ensError.message : String(ensError)}`);
          }
        }
        
        // Case 2: Resolve from address
        if (address && isValidEthereumAddress(address)) {
          try {
            setResolvedAddress(address);
            console.log(`Looking up ENS for address: ${address}`);
            
            const ens = await mainnetProvider.lookupAddress(address);
            if (ens) {
              console.log(`Address ${address} resolved to ENS: ${ens}`);
              setResolvedEns(ens);
              
              // Get ENS avatar
              try {
                const avatar = await fetchAvatarUrl(ens);
                if (avatar) {
                  setAvatarUrl(avatar);
                  console.log(`Avatar found for ${ens}: ${avatar}`);
                }
              } catch (avatarError) {
                console.warn(`Avatar fetch failed for ${ens}:`, avatarError);
              }
              
              // Get ENS text records
              try {
                const records = await getAllEnsRecords(ens);
                setEnsLinks(records);
                setEnsBio(records?.description || null);
                console.log(`ENS records for ${ens}:`, records);
              } catch (recordError) {
                console.warn(`ENS records fetch failed for ${ens}:`, recordError);
              }
            } else {
              console.log(`No ENS found for address ${address}`);
            }
          } catch (addrError) {
            console.error(`Error looking up ENS for address ${address}:`, addrError);
            // Set error but keep the address
            setError(`Error resolving ENS for address: ${addrError instanceof Error ? addrError.message : String(addrError)}`);
          }
        } else if (address && !isValidEthereumAddress(address)) {
          setError(`Invalid Ethereum address format: ${address}`);
          console.error(`Invalid Ethereum address: ${address}`);
        }
        
      } catch (error) {
        console.error("Unhandled error in ENS resolver:", error);
        setError(`Unexpected error: ${error instanceof Error ? error.message : String(error)}`);
      } finally {
        setIsLoading(false);
      }
    };

    resolveEnsData();
  }, [ensName, address]);

  return {
    resolvedAddress,
    resolvedEns,
    avatarUrl,
    ensLinks,
    ensBio,
    error,
    isLoading
  };
}
