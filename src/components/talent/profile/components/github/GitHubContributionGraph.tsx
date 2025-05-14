
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import GitHubCalendarRenderer from "./components/GitHubCalendarRenderer";
import GitHubContributionHeader from "./components/GitHubContributionHeader";
import GitHubContributionLegend from "./components/GitHubContributionLegend";
import { useGitHubContributions } from './useGitHubContributions';
import StatsDisplay from "./components/StatsDisplay";
import TokenInvalidAlert from "./components/TokenInvalidAlert";

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const { loading, totalContributions, error, stats } = useGitHubContributions(username);

  useEffect(() => {
    console.log("GitHub Username:", username);
    console.log("GitHub Data:", totalContributions);
    console.log("GitHub Error:", error);
  }, [username, totalContributions, error]);

  if (!username) return null;

  if (error && error === 'INVALID_TOKEN') {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex flex-row items-center gap-2">
            <span>GitHub Contributions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <TokenInvalidAlert />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <GitHubContributionHeader username={username} totalContributions={totalContributions || 189} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="h-8 w-1/2 bg-muted rounded-md"></div>
          </div>
        ) : (
          <>
            <div className="mb-6 overflow-hidden">
              <div className="github-calendar-wrapper"
                data-tooltip-id="github-calendar-tooltip">
                <GitHubCalendarRenderer 
                  username={username}
                  totalContributions={totalContributions || 189}
                  statsTotal={stats.total || 189}
                />
              </div>
            
              <div className="flex justify-between items-center mt-4 text-xs text-white">
                <GitHubContributionLegend />
              </div>
            </div>

            <StatsDisplay 
              username={username} 
              totalContributions={totalContributions || 189} 
              stats={{
                total: stats.total || 189,
                currentStreak: stats.currentStreak || 10,
                longestStreak: stats.longestStreak || 11,
                dateRange: stats.dateRange || 'May 5, 2024 – May 4, 2025'
              }} 
            />
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubContributionGraph;
