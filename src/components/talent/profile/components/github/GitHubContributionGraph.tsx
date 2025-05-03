// src/components/talent/profile/components/github/GitHubContributionGraph.tsx
import React, { useEffect } from 'react';

interface Props {
  username: string;
}

export default function GitHubContributionGraph({ username }: Props) {
  if (!username) return null;  // nothing to show without a username

  // GitHub’s “undocumented” SVG endpoint for the past year’s calendar
  const url = `https://github.com/users/${username}/contributions`;

  useEffect(() => {
    console.log('🔍 Loading GitHub graph from:', url);
  }, [url]);

  return (
    <div style={{ width: '100%', overflowX: 'auto', marginTop: '1rem' }}>
      <img
        src={url}
        alt={`${username}'s GitHub contributions`}
        style={{
          display: 'block',
          width: '100%',
          maxHeight: '200px',    // ensure it’s visible
          objectFit: 'contain',
          border: '1px solid #e1e4e8',
          borderRadius: '4px',
        }}
      />
    </div>
  );
}
