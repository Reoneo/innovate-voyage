
export interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no contributions, 4 = many contributions
}

export interface ContributionData {
  totalContributions: number;
  contributionCount?: number;
  contributions?: {
    date: string;
    count: number;
    level: 0 | 1 | 2 | 3 | 4;
  }[];
  user?: {
    name: string | null;
    login: string;
    avatarUrl: string;
    repositoriesContributedTo?: { totalCount: number };
  };
}

export interface GitHubContributionProps {
  username: string;
}
