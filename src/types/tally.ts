
export interface TallyData {
  governorInfo: {
    id: string;
    name: string;
    symbol: string;
    iconUrl?: string;
  };
  votingInfo: {
    votingPower: string;
    votingPowerPercent?: string;
    delegatesTo?: string | null;
    receivedDelegations: boolean;
    recentVotes: Array<{
      proposalId: string;
      proposalTitle: string;
      choice: string;
      timestamp: Date;
    }>;
  };
}
