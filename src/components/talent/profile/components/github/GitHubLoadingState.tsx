
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-16 w-full bg-gray-950 rounded-lg">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-5 h-5 rounded-full border-2 border-t-transparent border-blue-400 animate-spin mb-1"></div>
          <div className="text-xs text-gray-400">Loading GitHub activity...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-16 w-full bg-gray-950 rounded-lg p-2">
        <div className="text-red-500 text-sm font-medium">Error: {error}</div>
        <div className="text-xs text-gray-400 text-center">
          GitHub activity unavailable
        </div>
      </div>
    );
  }
  
  return null;
}
