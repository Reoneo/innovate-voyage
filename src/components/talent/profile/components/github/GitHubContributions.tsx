
import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
  isVerified: boolean;
}

const GitHubContributions: React.FC<Props> = ({ username, isVerified }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  
  console.log('🛠️ GitHubContributions render:', { username, isVerified });
  
  // Don't render at all if not verified or no username
  if (!isVerified || !username) {
    console.log('🛠️ GitHubContributions skipping render - not verified or no username');
    return null;
  }

  // Construct URL
  const contribUrl = `https://github.com/users/${username}/contributions`;

  // Debug logging
  useEffect(() => {
    console.log('[GitHubContributions] Loading:', contribUrl);
    
    // Check if the URL is accessible
    fetch(contribUrl, { method: 'HEAD' })
      .then(response => {
        console.log(`[GitHubContributions] URL check status: ${response.status}`);
        setIsLoading(false);
        setHasError(!response.ok);
      })
      .catch(error => {
        console.error('[GitHubContributions] URL check error:', error);
        setIsLoading(false);
        setHasError(true);
      });
  }, [contribUrl]);

  return (
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
          onLoad={() => console.log('[GitHubContributions] Image loaded successfully')}
          onError={(e) => {
            console.error('[GitHubContributions] Image failed to load:', e);
            setHasError(true);
          }}
        />
      )}
    </div>
  );
};

export default GitHubContributions;
