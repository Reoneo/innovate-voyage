
// Type definitions for Ethereum Follow Protocol

export interface EfpPerson {
  address: string;
  ensName?: string;
  avatar?: string;
}

export interface EfpStats {
  following: number;
  followers: number;
  followingList?: EfpPerson[];
  followersList?: EfpPerson[];
  mutualFollows?: number;
}

export interface EfpUserData {
  stats: EfpStats;
  followingAddresses: string[];
  friends: EfpPerson[];
  mutualFollowsList: EfpPerson[];
}
