
export interface ScoreCategory {
  name: string;
  score: number;
  maxScore: number;
  verified?: boolean;
}

export interface TalentProtocolScores {
  humanCheckmark: ScoreCategory;
  github: ScoreCategory;
  talentProtocol: ScoreCategory;
  onchainActivity: ScoreCategory;
  twitter: ScoreCategory;
  farcaster: ScoreCategory;
  base: ScoreCategory;
  bountycaster: ScoreCategory;
  build: ScoreCategory;
  celo: ScoreCategory;
  cryptoNomads: ScoreCategory;
  daoBase: ScoreCategory;
  developerDao: ScoreCategory;
  devfolio: ScoreCategory;
  ens: ScoreCategory;
  ethGlobal: ScoreCategory;
  lens: ScoreCategory;
  optimism: ScoreCategory;
  scroll: ScoreCategory;
  stack: ScoreCategory;
}
