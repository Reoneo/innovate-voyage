
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-24 w-full bg-gray-950 rounded-lg border border-gray-800">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-6 h-6 rounded-full border-2 border-t-transparent border-blue-400 animate-spin mb-2"></div>
          <div className="text-xs text-gray-400">Loading GitHub activity...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-24 w-full bg-gray-950 rounded-lg border border-gray-800 p-3">
        <div className="text-red-500 text-sm font-medium mb-1">Error: {error}</div>
        <div className="text-xs text-gray-400 text-center max-w-md">
          GitHub activity unavailable
        </div>
      </div>
    );
  }
  
  return null;
}
