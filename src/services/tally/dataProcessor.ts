
import { TallyData } from '@/types/tally';

/**
 * Process user governance data from Tally API response using accounts query
 */
export function processUserGovernanceData(userData: any, walletAddress: string): TallyData | null {
  console.log('🔍 Processing user governance data:', JSON.stringify(userData, null, 2));
  
  const accounts = userData?.accounts || [];
  console.log('📊 Found accounts:', accounts.length);
  
  if (accounts.length === 0) {
    console.log('❌ No account data found');
    return null;
  }

  const account = accounts[0];
  console.log('✅ Account found:', JSON.stringify(account, null, 2));
  
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
  console.log('🔍 Processing delegate data:', JSON.stringify(delegateData, null, 2));
  
  const delegations = delegateData?.delegatees?.nodes || [];
  console.log('📊 Found delegations:', delegations.length);
  
  if (delegations.length === 0) {
    console.log('❌ No delegate data found');
    return null;
  }

  const delegation = delegations[0];
  console.log('✅ Delegation found:', JSON.stringify(delegation, null, 2));
  
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
  console.log('🔍 Processing general delegates data:', JSON.stringify(delegatesData, null, 2));
  
  const delegates = delegatesData?.delegates?.nodes || [];
  console.log('📊 Found delegates:', delegates.length);
  
  if (delegates.length === 0) {
    console.log('❌ No delegates found');
    return null;
  }

  const delegate = delegates[0];
  console.log('✅ Using delegate:', JSON.stringify(delegate, null, 2));
  
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
