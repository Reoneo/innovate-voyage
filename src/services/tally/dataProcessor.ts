
import { TallyData } from '@/types/tally';

/**
 * Process user governance data from Tally API response using accounts query
 */
export function processUserGovernanceData(userData: any, walletAddress: string): TallyData | null {
  console.log('Processing user governance data:', userData);
  
  const accounts = userData?.accounts || [];
  
  if (accounts.length === 0) {
    console.log('No account data found');
    return null;
  }

  const account = accounts[0];
  console.log('Account found:', account);
  
  // Create basic governance data from account info
  return {
    governorInfo: {
      id: account.id?.toString() || 'unknown',
      name: account.name || 'Unknown DAO',
      symbol: 'TOKEN',
      iconUrl: account.picture || "https://assets.tally.xyz/tally-logo.svg",
      totalSupply: '0'
    },
    votingInfo: {
      address: walletAddress,
      delegatesTo: null,
      votingPower: account.votes?.toString() || '0',
      votingPowerPercent: '0%',
      receivedDelegations: account.proposalsCreatedCount > 0 ? `${account.proposalsCreatedCount} proposals created` : null,
      recentVotes: []
    }
  };
}

/**
 * Process delegate data from Tally API response
 */
export function processDelegateData(delegateData: any, walletAddress: string): TallyData | null {
  console.log('Processing delegate data:', delegateData);
  
  const delegations = delegateData?.delegatees?.nodes || [];
  
  if (delegations.length === 0) {
    console.log('No delegate data found');
    return null;
  }

  const delegation = delegations[0];
  console.log('Delegation found:', delegation);
  
  return {
    governorInfo: {
      id: delegation.organization?.id || delegation.token?.id || 'unknown',
      name: delegation.organization?.name || delegation.token?.name || 'Unknown DAO',
      symbol: delegation.token?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/governors/${delegation.organization?.slug || 'default'}/icon.svg`,
      totalSupply: delegation.token?.supply || '0'
    },
    votingInfo: {
      address: walletAddress,
      delegatesTo: delegation.delegate?.address || null,
      votingPower: delegation.votes?.toString() || '0',
      votingPowerPercent: '0%',
      receivedDelegations: null,
      recentVotes: []
    }
  };
}

/**
 * Process general delegates data when no user-specific data is available
 */
export function processGeneralDelegatesData(delegatesData: any, walletAddress: string): TallyData | null {
  console.log('Processing general delegates data:', delegatesData);
  
  const delegates = delegatesData?.delegates?.nodes || [];
  
  if (delegates.length === 0) {
    console.log('No delegates found');
    return null;
  }

  const delegate = delegates[0];
  console.log('Using delegate:', delegate);
  
  return {
    governorInfo: {
      id: delegate.governor?.id || delegate.organization?.id || 'unknown',
      name: delegate.governor?.name || delegate.organization?.name || 'Unknown DAO',
      symbol: delegate.governor?.token?.symbol || 'TOKEN',
      iconUrl: `https://assets.tally.xyz/governors/${delegate.governor?.slug || delegate.organization?.slug || 'default'}/icon.svg`,
      totalSupply: delegate.governor?.token?.supply || '0'
    },
    votingInfo: {
      address: walletAddress,
      delegatesTo: null,
      votingPower: '0',
      votingPowerPercent: '0%',
      receivedDelegations: null,
      recentVotes: []
    }
  };
}
