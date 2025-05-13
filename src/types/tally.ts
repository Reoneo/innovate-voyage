
export interface TallyGovernorInfo {
  id: string;
  name: string;
  symbol: string;
  iconUrl?: string;
  totalSupply?: string;
  proposals?: TallyProposal[];
}

export interface TallyProposal {
  id: string;
  title: string;
  description?: string;
  status: 'active' | 'passed' | 'failed' | 'pending';
  proposer: string;
  startBlock: number;
  endBlock: number;
  votesFor?: string;
  votesAgainst?: string;
  votesAbstain?: string;
}

export interface TallyVotingInfo {
  address: string;
  delegatesTo?: string;
  votingPower?: string;
  votingPowerPercent?: string;
  receivedDelegations?: string;
  recentVotes?: TallyVote[];
}

export interface TallyVote {
  proposalId: string;
  proposalTitle: string;
  choice: 'for' | 'against' | 'abstain';
  timestamp: number;
}

export interface TallyData {
  governorInfo: TallyGovernorInfo;
  votingInfo: TallyVotingInfo;
}
