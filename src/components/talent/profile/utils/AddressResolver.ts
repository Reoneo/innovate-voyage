
import { isValidEthereumAddress } from '@/lib/utils';

/**
 * Resolves user identifiers (ENS name or Ethereum address) from route params
 */
export function resolveUserIdentifier(params: {
  ensName?: string;
  address?: string;
  userId?: string;
  ensNameOrAddress?: string;
}): { resolvedAddress?: string; resolvedEns?: string } {
  const { ensName, address: routeAddress, userId, ensNameOrAddress } = params;

  if (userId) {
    if (isValidEthereumAddress(userId)) {
      return { resolvedAddress: userId };
    } else {
      const ensValue = userId.includes('.') ? userId : `${userId}.eth`;
      return { resolvedEns: ensValue };
    }
  } else if (routeAddress) {
    return { resolvedAddress: routeAddress };
  } else if (ensName) {
    if (isValidEthereumAddress(ensName)) {
      return { resolvedAddress: ensName };
    } else {
      const ensValue = ensName.includes('.') ? ensName : `${ensName}.eth`;
      return { resolvedEns: ensValue };
    }
  } else if (ensNameOrAddress) {
    if (isValidEthereumAddress(ensNameOrAddress)) {
      return { resolvedAddress: ensNameOrAddress };
    } else {
      const ensValue = ensNameOrAddress.includes('.') ? ensNameOrAddress : `${ensNameOrAddress}.eth`;
      return { resolvedEns: ensValue };
    }
  }

  return {};
}
