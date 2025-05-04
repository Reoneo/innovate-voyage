
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-32 w-full bg-gray-950 rounded-lg border border-gray-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-8 h-8 rounded-full border-2 border-t-transparent border-blue-400 animate-spin mb-2"></div>
          <div className="text-sm text-gray-400">Loading GitHub activity graph...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-32 w-full bg-gray-950 rounded-lg border border-gray-800 p-4">
        <div className="text-red-500 font-medium mb-1">Error: {error}</div>
        <div className="text-xs text-gray-400 text-center max-w-md">
          GitHub activity graph could not be loaded. GitHub API might be unavailable or the token may have expired.
        </div>
      </div>
    );
  }
  
  return null;
}
