
import { useAccount, useEnsName, useEnsAvatar, useEnsResolver } from 'wagmi';
import { normalize } from 'viem/ens';

export function useEnsProfile() {
  const { address, isConnected } = useAccount();
  const { data: ensName, isLoading: isLoadingName } = useEnsName({ 
    address,
    chainId: 1 // Mainnet for ENS
  });
  
  const { data: ensAvatar, isLoading: isLoadingAvatar } = useEnsAvatar({ 
    name: ensName ? normalize(ensName) : undefined,
    chainId: 1
  });

  const { data: resolver } = useEnsResolver({
    name: ensName ? normalize(ensName) : undefined,
    chainId: 1
  });

  return {
    address,
    ensName,
    ensAvatar,
    resolver,
    isConnected,
    isLoading: isLoadingName || isLoadingAvatar
  };
}
