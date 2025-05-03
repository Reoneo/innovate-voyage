
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <div className="animate-pulse text-sm text-gray-500">Loading GitHub activity graph...</div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-900 rounded-lg p-4">
        <div className="text-red-500 font-medium mb-2">Error: {error}</div>
        <div className="text-xs text-gray-400">
          {error.includes('authentication') || error.includes('rate limit') ? 
            'GitHub API rate limit may have been reached. Try again later.' : 
            'GitHub API might be unavailable or the token may have expired.'}
        </div>
      </div>
    );
  }
  
  return null;
}
