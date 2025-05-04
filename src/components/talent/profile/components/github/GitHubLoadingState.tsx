
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-12 w-full bg-gray-950 rounded-lg">
        <div className="animate-pulse flex items-center gap-2">
          <div className="w-4 h-4 rounded-full border-2 border-t-transparent border-blue-400 animate-spin"></div>
          <div className="text-xs text-gray-300">Loading GitHub activity...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-12 w-full bg-gray-950 rounded-lg p-2">
        <div className="text-red-500 text-sm font-medium">Error: {error}</div>
        <div className="text-xs text-gray-300 text-center">
          GitHub activity unavailable
        </div>
      </div>
    );
  }
  
  return null;
}
