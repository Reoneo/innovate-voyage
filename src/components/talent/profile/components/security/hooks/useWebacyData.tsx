import { useWebacyData as useGlobalWebacyData } from '@/hooks/useWebacyData';

// This component-level hook now leverages the global hook to avoid duplicate calls
export function useWebacyData(walletAddress?: string) {
  // Use the global hook implementation to avoid duplicate API calls
  return useGlobalWebacyData(walletAddress);
}
