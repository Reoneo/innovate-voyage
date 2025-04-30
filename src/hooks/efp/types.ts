
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
}
