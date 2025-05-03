
import React, { useEffect, useState } from 'react';

interface Props {
  username: string;
}

export default function GitHubContributionGraph({ username }: Props) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  if (!username) return null;  // nothing to show without a username

  // GitHub's "undocumented" SVG endpoint for the past year's calendar
  const url = `https://github.com/users/${username}/contributions`;

  useEffect(() => {
    console.log('🔍 Loading GitHub graph from:', url);
    
    // Test if the URL is accessible
    fetch(url, { method: 'HEAD' })
      .then(response => {
        console.log(`GitHub graph URL check: ${response.status}`);
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
  }, [url]);

  return (
    <div 
      style={{ 
        width: '100%', 
        overflowX: 'auto', 
        marginTop: '1rem',
        minHeight: '120px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      {loading && <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>}
      {error && <div className="text-sm text-red-500">{error}</div>}
      
      {isVisible && (
        <img
          src={url}
          alt={`${username}'s GitHub contributions`}
          style={{
            display: 'block',
            width: '100%',
            maxHeight: '200px',
            objectFit: 'contain',
            border: '1px solid #e1e4e8',
            borderRadius: '4px',
          }}
          onLoad={() => console.log('GitHub contribution graph loaded successfully')}
          onError={(e) => {
            console.error('GitHub contribution graph failed to load:', e);
            setError('Failed to load GitHub activity graph');
            setIsVisible(false);
          }}
        />
      )}
    </div>
  );
}
