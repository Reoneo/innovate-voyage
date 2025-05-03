
import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
}

// GitHub API token for authenticated requests
const GITHUB_API_TOKEN = "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";

export default function GitHubContributionGraph({ username }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);
  
  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  // GitHub's contribution graph SVG URL
  const svgUrl = `https://github.com/users/${username}/contributions`;
  
  // GitHub API URL for fetching user data (to verify account exists)
  const apiUrl = `https://api.github.com/users/${username}`;

  useEffect(() => {
    console.log('🔍 Loading GitHub graph for:', username);
    
    const fetchGitHubData = async () => {
      try {
        // First, verify the GitHub user exists with the API token
        const response = await fetch(apiUrl, {
          headers: {
            'Authorization': `token ${GITHUB_API_TOKEN}`,
            'Accept': 'application/vnd.github.v3+json'
          }
        });

        if (!response.ok) {
          console.error(`GitHub API returned ${response.status} for ${username}`);
          setError(`GitHub user not found (${response.status})`);
          setLoading(false);
          return;
        }

        const userData = await response.json();
        console.log(`Found GitHub user: ${userData.login} (${userData.name || 'No name'})`);
        
        // User exists, we can now show the contribution graph
        setIsVisible(true);
        setContributionData(userData);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching GitHub data:', err);
        setError('Failed to access GitHub API');
        setLoading(false);
      }
    };

    fetchGitHubData();
  }, [username, apiUrl]);

  return (
    <div 
      className="w-full overflow-x-auto mt-4 min-h-[120px] flex flex-col justify-center"
    >
      {loading && <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      {isVisible && (
        <>
          {contributionData && (
            <div className="flex items-center gap-2 mb-2">
              <img 
                src={contributionData.avatar_url} 
                alt={`${username}'s avatar`} 
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {contributionData.name || username} • {contributionData.public_repos} repositories
              </span>
            </div>
          )}
          
          <img
            src={svgUrl}
            alt={`${username}'s GitHub contributions`}
            className="block w-full max-h-[160px] object-contain border border-gray-200 rounded-md bg-white"
            onLoad={() => console.log('GitHub contribution graph loaded successfully for', username)}
            onError={(e) => {
              console.error('GitHub contribution graph failed to load for', username, e);
              setError('Failed to load GitHub activity graph');
              setIsVisible(false);
            }}
          />
          
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
