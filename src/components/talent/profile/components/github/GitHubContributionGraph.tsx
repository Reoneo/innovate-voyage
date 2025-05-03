
import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
}

export default function GitHubContributionGraph({ username }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  // GitHub's "undocumented" SVG endpoint for the past year's calendar
  const url = `https://github.com/users/${username}/contributions`;

  useEffect(() => {
    console.log('🔍 Loading GitHub graph for:', username, 'URL:', url);
    
    // Test if the URL is accessible
    fetch(url, { method: 'HEAD' })
      .then(response => {
        console.log(`GitHub graph URL check: ${response.status} for ${username}`);
        if (!response.ok) {
          setError(`Failed to load GitHub contributions (status: ${response.status})`);
        } else {
          setIsVisible(true);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error('Error checking GitHub contributions URL:', err);
        setError('Failed to access GitHub contributions');
        setLoading(false);
      });
  }, [url, username]);

  return (
    <div 
      className="w-full overflow-x-auto mt-4 min-h-[120px] flex flex-col justify-center"
    >
      {loading && <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      {isVisible && (
        <img
          src={url}
          alt={`${username}'s GitHub contributions`}
          className="block w-full max-h-[200px] object-contain border border-gray-200 rounded-md"
          onLoad={() => console.log('GitHub contribution graph loaded successfully for', username)}
          onError={(e) => {
            console.error('GitHub contribution graph failed to load for', username, e);
            setError('Failed to load GitHub activity graph');
            setIsVisible(false);
          }}
        />
      )}
    </div>
  );
}
