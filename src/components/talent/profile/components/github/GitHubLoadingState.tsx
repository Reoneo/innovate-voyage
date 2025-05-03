
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
  isUsingFallback?: boolean;
}

export default function GitHubLoadingState({ loading, error, isUsingFallback }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-8 w-8 rounded-full border-t-2 border-blue-500 animate-spin mb-2"></div>
          <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-900 rounded-lg p-4">
        <div className="text-red-500 font-medium mb-2">Error: {error}</div>
        {isUsingFallback && (
          <div className="text-yellow-500 text-xs mb-2">
            Attempting to use fallback method...
          </div>
        )}
        <div className="text-xs text-gray-400 text-center">
          {error.includes('authentication') || error.includes('rate limit') ? 
            'GitHub API authentication issue or rate limiting. Trying alternative access method.' : 
            'GitHub API might be unavailable or there might be an issue with the request.'}
        </div>
      </div>
    );
  }
  
  return null;
}
