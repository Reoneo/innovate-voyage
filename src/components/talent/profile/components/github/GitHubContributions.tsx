// src/components/github/GitHubContributions.tsx

import React, { useEffect } from 'react';

interface Props {
  username: string;
  isVerified: boolean;
}

export default function GitHubContributions({ username, isVerified }: Props) {
  if (!isVerified || !username) return null;

  const url = `https://github.com/users/${username}/contributions`;

  useEffect(() => {
    console.log('Loading GitHub graph from:', url);
  }, [url]);

  return (
    <img
      src={url}
      alt={`${username}'s contributions`}
      style={{
        display: 'block',
        width: '100%',       // fill its container
        maxHeight: '200px',  // prevent it from collapsing
        border: '1px solid #ddd',
      }}
    />
  );
}
