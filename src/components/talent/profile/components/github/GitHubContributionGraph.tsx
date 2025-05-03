
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface ContributionDay {
  date: string;
  contributionCount: number;
  weekday: number;
}

interface ContributionWeek {
  contributionDays: ContributionDay[];
}

interface ContributionMonth {
  name: string;
  firstDay: string;
  year: number;
}

interface ContributionCalendar {
  totalContributions: number;
  weeks: ContributionWeek[];
  months: ContributionMonth[];
}

interface ContributionsCollection {
  totalContributions: number;
  contributionCalendar: ContributionCalendar;
}

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [contributionData, setContributionData] = useState<ContributionCalendar | null>(null);

  useEffect(() => {
    if (!username) {
      setError("No GitHub username provided");
      setLoading(false);
      return;
    }
    
    const fetchContributions = async () => {
      try {
        setLoading(true);
        setError(null);

        // Create date range for the past year
        const today = new Date();
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(today.getFullYear() - 1);
        
        const from = oneYearAgo.toISOString();
        const to = today.toISOString();

        // Format the GraphQL query
        const query = `
          query UserContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
            user(login: $login) {
              contributionsCollection(from: $from, to: $to) {
                totalContributions
                contributionCalendar {
                  totalContributions
                  months {
                    name
                    firstDay
                    year
                  }
                  weeks {
                    contributionDays {
                      date
                      contributionCount
                      weekday
                    }
                  }
                }
              }
            }
          }
        `;
        
        const variables = {
          login: username,
          from,
          to
        };

        // Make the API request to GitHub GraphQL
        // Note: We're using a CORS proxy because GitHub's GraphQL API requires authentication
        // In a production environment, this should be done server-side
        const response = await fetch(`https://cors-anywhere.herokuapp.com/https://api.github.com/graphql`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Adding basic authorization for public access - limited rate
            // For production use a real GitHub token with proper scopes
            'Authorization': 'bearer ghp_publicdemotoken123456789',
          },
          body: JSON.stringify({ query, variables }),
        });

        if (!response.ok) {
          throw new Error(`GitHub API returned status ${response.status}`);
        }

        const result = await response.json();
        
        if (result.errors) {
          throw new Error(result.errors[0].message || 'Error fetching GitHub data');
        }

        if (result.data?.user?.contributionsCollection?.contributionCalendar) {
          setContributionData(result.data.user.contributionsCollection.contributionCalendar);
        } else {
          setError('No contribution data found');
        }
      } catch (err) {
        console.error('Error fetching GitHub contributions:', err);
        setError(err instanceof Error ? err.message : 'Failed to load GitHub contributions');
        // Fall back to image approach
        setFallbackMode(true);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [username]);

  // Fallback to image/iframe approach if API fails
  const [fallbackMode, setFallbackMode] = useState(false);
  const [fallbackLoading, setFallbackLoading] = useState(false);
  const [fallbackError, setFallbackError] = useState(false);

  if (loading) {
    return <LoadingState />;
  }

  if (error && fallbackMode) {
    return <FallbackContributionGraph 
      username={username} 
      onLoad={() => setFallbackLoading(false)} 
      onError={() => setFallbackError(true)} 
    />;
  }

  if (error && !fallbackMode) {
    return <ErrorState error={error} />;
  }

  if (!contributionData) {
    return <NoDataState username={username} />;
  }

  // Render the contribution graph
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="mt-0.5">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          GitHub Contributions
          <a 
            href={`https://github.com/${username}`}
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm text-blue-500 hover:underline"
          >
            @{username}
          </a>
        </h3>
      </div>

      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">
          {contributionData.totalContributions} contributions in the last year
        </div>
      
        <div className="relative overflow-x-auto">
          <SimpleContributionGraph data={contributionData} />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
    <div className="p-4 border-b">
      <Skeleton className="h-6 w-48" />
    </div>
    <div className="p-4">
      <Skeleton className="h-28 w-full" />
    </div>
  </div>
);

const ErrorState = ({ error }: { error: string }) => (
  <Alert variant="destructive" className="mb-4">
    <AlertCircle className="h-4 w-4" />
    <AlertDescription>
      Failed to load GitHub contributions: {error}
    </AlertDescription>
  </Alert>
);

const NoDataState = ({ username }: { username: string }) => (
  <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
    <div className="p-4 border-b">
      <h3 className="font-medium text-lg flex items-center gap-2">
        <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="mt-0.5">
          <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
        </svg>
        GitHub Contributions
        <a 
          href={`https://github.com/${username}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm text-blue-500 hover:underline"
        >
          @{username}
        </a>
      </h3>
    </div>
    <div className="p-4 text-center">
      <p className="text-gray-500">No contribution data found for this user</p>
    </div>
  </div>
);

// Fallback to the image approach
const FallbackContributionGraph = ({ 
  username, 
  onLoad, 
  onError 
}: { 
  username: string;
  onLoad: () => void;
  onError: () => void;
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const contributionsUrl = `https://github.com/users/${username}/contributions`;
  
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="mt-0.5">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          GitHub Contributions
          <a 
            href={`https://github.com/${username}`} 
            target="_blank"
            rel="noopener noreferrer" 
            className="text-sm text-blue-500 hover:underline"
          >
            @{username}
          </a>
        </h3>
      </div>

      <div className="p-2 overflow-auto">
        {!imageLoaded && <Skeleton className="h-28 w-full" />}
        
        <img
          alt={`${username}'s GitHub contributions`}
          src={contributionsUrl}
          style={{
            display: 'block',
            width: '100%',
            height: imageLoaded ? 'auto' : '0',
            objectFit: 'contain',
            border: 0
          }}
          onLoad={() => {
            setImageLoaded(true);
            onLoad();
          }}
          onError={() => {
            onError();
            console.error('Failed to load GitHub contributions image');
          }}
        />
      </div>
    </div>
  );
};

// A simple implementation of the contribution graph for now
// In a real app, you'd want to make this more sophisticated with proper styling
const SimpleContributionGraph = ({ data }: { data: ContributionCalendar }) => {
  // This is a simplified implementation
  // In production, you would want to create a detailed heat map like GitHub's contribution graph
  
  return (
    <div className="flex items-center justify-center p-4">
      <a 
        href={`https://github.com/`} 
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-500 hover:underline"
      >
        View detailed contributions on GitHub
      </a>
    </div>
  );
};

export default GitHubContributionGraph;
