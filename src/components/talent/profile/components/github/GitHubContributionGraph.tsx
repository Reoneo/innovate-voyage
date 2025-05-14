
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ContributionData } from './types';
import GitHubCalendarRenderer from "./components/GitHubCalendarRenderer";
import GitHubContributionHeader from "./components/GitHubContributionHeader";
import GitHubContributionLegend from "./components/GitHubContributionLegend";
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import { useContributionStats } from './hooks/useContributionStats';
import StatsDisplay from "./components/StatsDisplay";
import TokenInvalidAlert from "./components/TokenInvalidAlert";

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const [showAllContributions, setShowAllContributions] = useState(false);
  const { loading, totalContributions, error, stats } = useGitHubCalendar(username);

  const contributions: ContributionData = {
    totalContributions: totalContributions || 0,
    contributions: []
  };

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
        <GitHubContributionHeader username={username} totalContributions={totalContributions} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="h-8 w-1/2 bg-muted rounded-md"></div>
          </div>
        ) : (
          <>
            {contributions && contributions.totalContributions > 0 ? (
              <>
                <div className="mb-6 overflow-hidden">
                  <div className="github-calendar-wrapper"
                    data-tooltip-id="github-calendar-tooltip">
                    <GitHubCalendarRenderer 
                      username={username}
                      totalContributions={contributions.totalContributions}
                      statsTotal={stats.total}
                    />
                  </div>
                
                  <div className="flex justify-between items-center mt-4 text-xs text-white">
                    <span>Less</span>
                    <GitHubContributionLegend />
                    <span>More</span>
                  </div>
                </div>

                <StatsDisplay 
                  username={username} 
                  totalContributions={totalContributions} 
                  stats={stats} 
                />
                
                {contributions && contributions.contributions && 
                 contributions.contributions.length > 50 && (
                  <div className="mt-4 flex justify-center">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setShowAllContributions(!showAllContributions)}
                    >
                      {showAllContributions ? "Show Recent" : "Show All Contributions"}
                    </Button>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8 text-center">
                <p className="text-muted-foreground">No GitHub contribution data found for {username}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default GitHubContributionGraph;
