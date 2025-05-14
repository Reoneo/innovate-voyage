
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { ContributionData } from './types';
import GitHubCalendarRenderer from "./components/GitHubCalendarRenderer";
import GitHubContributionHeader from "./components/GitHubContributionHeader";
import GitHubContributionLegend from "./components/GitHubContributionLegend";
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import { useContributionStats } from './hooks/useContributionStats';
import { ThemeInput } from 'react-github-calendar';
import StatsDisplay from "./components/StatsDisplay";
import TokenInvalidAlert from "./components/TokenInvalidAlert";

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const [showAllContributions, setShowAllContributions] = useState(false);
  const { loading, contributionData, error } = useGitHubCalendar(username);
  const stats = useContributionStats(contributionData);

  const contributions: ContributionData = contributionData || {
    total: 0,
    contributions: []
  };

  useEffect(() => {
    console.log("GitHub Username:", username);
    console.log("GitHub Data:", contributionData);
    console.log("GitHub Error:", error);
  }, [username, contributionData, error]);

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
          <TokenInvalidAlert username={username} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md overflow-hidden">
      <CardHeader className="pb-2">
        <GitHubContributionHeader username={username} loading={loading} />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-40 bg-muted rounded-md"></div>
            <div className="h-8 w-1/2 bg-muted rounded-md"></div>
          </div>
        ) : (
          <>
            {contributions && contributions.total > 0 ? (
              <>
                <div className="mb-6 overflow-hidden">
                  <div className="github-calendar-wrapper"
                    data-tooltip-id="github-calendar-tooltip">
                    <GitHubCalendarRenderer 
                      data={contributions}
                      showAllContributions={showAllContributions}
                      theme={{
                        level0: '#ebedf0',
                        level1: '#c6e48b',
                        level2: '#7bc96f',
                        level3: '#239a3b',
                        level4: '#196127',
                        text: '#ffffff' // White text color for better visibility
                      }}
                    />
                  </div>
                
                  <div className="flex justify-between items-center mt-4 text-xs text-white">
                    <span>Less</span>
                    <GitHubContributionLegend />
                    <span>More</span>
                  </div>
                </div>

                <StatsDisplay stats={stats} />
                
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
