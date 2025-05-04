
import React, { useEffect, useState } from 'react';

interface GitHubContributionsProps {
  data: any;
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ data, username }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  
  if (!username) {
    return null;
  }
  
  // Construct URL for GitHub contributions
  const contribUrl = `https://github.com/users/${username}/contributions`;
  
  useEffect(() => {
    console.log(`Loading GitHub contributions for: ${username}`);
    
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
    <div className="mt-6">
      <h3 className="text-lg font-semibold mb-3">GitHub Contributions</h3>
      
      <div className="github-heatmap-wrapper" style={{ 
        width: '100%', 
        overflowX: 'auto',
        border: '1px solid #e1e4e8',
        borderRadius: '6px',
        padding: '12px',
        backgroundColor: '#f6f8fa',
        marginBottom: '16px',
        minHeight: '160px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {isLoading && (
          <div className="text-gray-500">Loading GitHub contribution data...</div>
        )}
        
        {hasError && (
          <div className="text-red-500">Unable to load GitHub contributions graph</div>
        )}
        
        {!isLoading && !hasError && (
          <img
            className="github-heatmap"
            src={contribUrl}
            alt={`${username}'s GitHub contributions`}
            style={{
              display: 'block',
              width: '100%',
              height: '150px',
              maxHeight: '200px',
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
      </div>
      
      {data && (
        <div className="mt-4">
          {/* Display contribution stats if available */}
          {data.contributions && (
            <div className="text-sm text-muted-foreground">
              {data.contributions.totalContributions} contributions in the last year
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default GitHubContributions;
