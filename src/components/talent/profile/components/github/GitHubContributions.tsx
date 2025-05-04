
import React, { useEffect, useState } from 'react';

interface GitHubContributionsProps {
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [contributionData, setContributionData] = useState<any>(null);
  
  if (!username) {
    return null;
  }
  
  // Construct URL for GitHub contributions
  const contribUrl = `https://github.com/users/${username}/contributions`;
  
  useEffect(() => {
    if (!username) return;
    
    console.log(`Loading GitHub contributions for: ${username}`);
    setIsLoading(true);
    setHasError(false);
    
    // Try to get cached data first
    const cachedData = localStorage.getItem(`github_contributions_${username}`);
    if (cachedData) {
      try {
        const parsedData = JSON.parse(cachedData);
        console.log('Using cached GitHub data', parsedData);
        setContributionData(parsedData);
      } catch (err) {
        console.error('Error parsing cached GitHub data:', err);
      }
    }
    
    // Check if the URL is accessible
    fetch(contribUrl, { method: 'HEAD' })
      .then(response => {
        console.log(`GitHub contribution URL check status: ${response.status}`);
        setHasError(!response.ok);
      })
      .catch(error => {
        console.error('GitHub contribution URL check error:', error);
        setHasError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [username, contribUrl]);
  
  return (
    <div className="w-full">
      {isLoading && (
        <div className="text-gray-500 text-center py-4">Loading GitHub contribution data...</div>
      )}
      
      {hasError && (
        <div className="text-red-500 text-center py-4">Unable to load GitHub contributions graph</div>
      )}
      
      {!isLoading && !hasError && (
        <img
          className="github-heatmap"
          src={contribUrl}
          alt={`${username}'s GitHub contributions`}
          style={{
            display: 'block',
            width: '100%',
            height: 'auto',
            maxHeight: '150px',
            objectFit: 'contain',
            borderRadius: '4px',
          }}
          onLoad={() => console.log('GitHub contribution image loaded successfully')}
          onError={(e) => {
            console.error('GitHub contribution image failed to load:', e);
            setHasError(true);
          }}
        />
      )}
      
      {contributionData && contributionData.totalContributions && (
        <div className="text-sm text-muted-foreground mt-2 text-center">
          {contributionData.totalContributions} contributions in the last year
        </div>
      )}
    </div>
  );
};

export default GitHubContributions;
