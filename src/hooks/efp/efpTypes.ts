
export type EfpPerson = {
  address: string;
  ensName?: string;
  avatar?: string;
};

export type EfpStats = {
  following: number;
  followers: number;
  followingList?: EfpPerson[];
  followersList?: EfpPerson[];
};

export type FollowLoadingState = {
  [key: string]: boolean;
};
