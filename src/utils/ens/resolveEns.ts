
// ENS resolution functionality (refactored)
import { 
  resolveEnsToAddress as resolveEnsToAddressImpl,
  resolveAddressToEns as resolveAddressToEnsImpl
} from './resolution';

/**
 * Resolve ENS name to address
 * @param ensName The ENS name to resolve
 * @param timeoutMs Maximum time to wait for resolution
 * @returns Ethereum address or null
 */
export async function resolveEnsToAddress(ensName: string, timeoutMs = 5000): Promise<string | null> {
  return resolveEnsToAddressImpl(ensName, timeoutMs);
}

/**
 * Resolve Ethereum address to ENS name
 * @param address The Ethereum address to resolve
 * @param timeoutMs Maximum time to wait for resolution
 * @returns ENS information or null
 */
export async function resolveAddressToEns(address: string, timeoutMs = 5000) {
  return resolveAddressToEnsImpl(address, timeoutMs);
}
