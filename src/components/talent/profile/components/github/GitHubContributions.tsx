
import React, { useEffect } from 'react';

interface Props {
  username: string;
  isVerified: boolean;
}

const GitHubContributions: React.FC<Props> = ({ username, isVerified }) => {
  // Don't render at all if not verified
  if (!isVerified || !username) return null;

  // Construct URL
  const contribUrl = `https://github.com/users/${username}/contributions`;

  // Debug logging
  useEffect(() => {
    console.log('[GitHubContributions] Loading:', contribUrl);
  }, [contribUrl]);

  return (
    <div className="github-heatmap-wrapper" style={{ width: '100%', overflowX: 'auto' }}>
      <img
        className="github-heatmap"
        src={contribUrl}
        alt={`${username}'s GitHub contributions`}
        // Explicit sizing so it's never 0×0
        style={{
          display: 'block',
          width: '100%',
          maxHeight: '200px',
          objectFit: 'contain',
          border: '1px solid #e1e4e8',
          borderRadius: '4px',
        }}
      />
    </div>
  );
};

export default GitHubContributions;
