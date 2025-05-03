
import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
}

// GitHub API token for authenticated requests
const GITHUB_API_TOKEN = "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";

interface ContributionDay {
  date: string;
  count: number;
  level: 0 | 1 | 2 | 3 | 4; // 0 = no contributions, 4 = many contributions
}

interface ContributionData {
  totalContributions: number;
  weeks: {
    contributionDays: ContributionDay[];
  }[];
  user: {
    name: string | null;
    login: string;
    avatarUrl: string;
    repositoriesContributedTo: { totalCount: number };
  };
}

export default function GitHubContributionGraph({ username }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionData | null>(null);
  const [yearlyTotal, setYearlyTotal] = useState<number | null>(null);
  
  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  useEffect(() => {
    console.log('🔍 Loading GitHub graph for:', username);
    
    const fetchGitHubContributions = async () => {
      try {
        // First, verify the GitHub user exists
        const userResponse = await fetch(`https://api.github.com/users/${username}`, {
          headers: {
            'Authorization': `token ${GITHUB_API_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!userResponse.ok) {
          console.error(`GitHub API returned ${userResponse.status} for ${username}`);
          setError(`GitHub user not found (${userResponse.status})`);
          setLoading(false);
          return;
        }

        const userData = await userResponse.json();
        console.log(`Found GitHub user: ${userData.login} (${userData.name || 'No name'})`);
        
        // Now fetch the contributions data with GraphQL
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        const query = `
          query {
            user(login: "${username}") {
              name
              login
              avatarUrl
              contributionsCollection(from: "${oneYearAgo.toISOString()}", to: "${today.toISOString()}") {
                contributionCalendar {
                  totalContributions
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      contributionLevel
                    }
                  }
                }
              }
              repositoriesContributedTo(first: 1) {
                totalCount
              }
            }
          }
        `;

        const graphqlResponse = await fetch('https://api.github.com/graphql', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${GITHUB_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query })
        });

        if (!graphqlResponse.ok) {
          throw new Error(`GraphQL request failed: ${graphqlResponse.status}`);
        }

        const graphqlData = await graphqlResponse.json();
        
        if (graphqlData.errors) {
          console.error('GraphQL errors:', graphqlData.errors);
          throw new Error(graphqlData.errors[0].message);
        }

        if (!graphqlData.data || !graphqlData.data.user) {
          throw new Error('No user data returned from GitHub GraphQL API');
        }
        
        // Process the data
        const contributionCalendar = graphqlData.data.user.contributionsCollection.contributionCalendar;
        const processed = {
          totalContributions: contributionCalendar.totalContributions,
          weeks: contributionCalendar.weeks.map((week: any) => ({
            contributionDays: week.contributionDays.map((day: any) => ({
              date: day.date,
              count: day.contributionCount,
              level: day.contributionLevel === 'NONE' ? 0 :
                     day.contributionLevel === 'FIRST_QUARTILE' ? 1 :
                     day.contributionLevel === 'SECOND_QUARTILE' ? 2 :
                     day.contributionLevel === 'THIRD_QUARTILE' ? 3 : 4
            }))
          })),
          user: {
            name: graphqlData.data.user.name,
            login: graphqlData.data.user.login,
            avatarUrl: graphqlData.data.user.avatarUrl,
            repositoriesContributedTo: graphqlData.data.user.repositoriesContributedTo
          }
        };

        setContributionData(processed);
        setYearlyTotal(contributionCalendar.totalContributions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub contribution data:', err);
        setError(err instanceof Error ? err.message : 'Failed to access GitHub API');
        setLoading(false);
      }
    };

    fetchGitHubContributions();
  }, [username]);

  // Generate days of the week labels
  const daysOfWeek = ['Mon', 'Wed', 'Fri'];

  // Generate month labels
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  // Helper function to get level class
  const getLevelClass = (level: number) => {
    switch(level) {
      case 0: return 'bg-gray-800';
      case 1: return 'bg-green-900';
      case 2: return 'bg-green-700';
      case 3: return 'bg-green-600';
      case 4: return 'bg-green-500';
      default: return 'bg-gray-800';
    }
  };

  return (
    <div 
      className="w-full overflow-x-auto mt-4 min-h-[200px] flex flex-col justify-center"
    >
      {loading && <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      {!loading && !error && contributionData && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={contributionData.user.avatarUrl} 
              alt={`${username}'s avatar`} 
              className="w-6 h-6 rounded-full"
            />
            <span className="text-sm text-gray-600">
              {contributionData.user.name || username} • {contributionData.user.repositoriesContributedTo.totalCount} repositories
            </span>
          </div>
          
          <div className="bg-gray-900 p-4 rounded-lg">
            <div className="text-white text-lg mb-4">
              {yearlyTotal} contributions in the last year
            </div>
            
            <div className="relative overflow-x-auto">
              {/* Month labels */}
              <div className="flex mb-2">
                <div className="w-8"></div> {/* Spacer for day labels */}
                <div className="flex flex-1 justify-between">
                  {months.map((month, i) => (
                    <div key={i} className="text-sm text-gray-400">{month}</div>
                  ))}
                </div>
              </div>
              
              {/* Contribution grid with day labels */}
              <div className="flex">
                {/* Day of week labels */}
                <div className="flex flex-col justify-between pr-2">
                  {daysOfWeek.map((day, i) => (
                    <div key={i} className="h-4 text-xs text-gray-400">{day}</div>
                  ))}
                </div>
                
                {/* Contribution grid */}
                {contributionData.weeks.length > 0 ? (
                  <div className="flex flex-1 gap-1">
                    {contributionData.weeks.map((week, weekIndex) => (
                      <div key={weekIndex} className="flex flex-col gap-1">
                        {week.contributionDays.map((day, dayIndex) => (
                          <div 
                            key={dayIndex} 
                            className={`w-3 h-3 rounded-sm ${getLevelClass(day.level)}`}
                            title={`${day.count} contributions on ${day.date}`}
                          />
                        ))}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400 text-sm">No contribution data available</div>
                )}
              </div>
              
              {/* Legend */}
              <div className="flex justify-between items-center mt-4 text-xs text-gray-400">
                <div>Learn how we count contributions</div>
                <div className="flex items-center gap-1">
                  <span>Less</span>
                  <div className={`w-3 h-3 rounded-sm ${getLevelClass(0)}`}></div>
                  <div className={`w-3 h-3 rounded-sm ${getLevelClass(1)}`}></div>
                  <div className={`w-3 h-3 rounded-sm ${getLevelClass(2)}`}></div>
                  <div className={`w-3 h-3 rounded-sm ${getLevelClass(3)}`}></div>
                  <div className={`w-3 h-3 rounded-sm ${getLevelClass(4)}`}></div>
                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-2 text-right">
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View GitHub Profile →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
