
import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-40 w-full">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-6 w-6 text-blue-500 animate-spin" />
          <div className="text-sm text-gray-500">Loading GitHub contribution data...</div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-900 rounded-lg p-4">
        <AlertCircle className="h-8 w-8 text-red-500 mb-2" />
        <div className="text-red-500 font-medium mb-2">Error loading GitHub data</div>
        <div className="text-xs text-gray-400 text-center">
          {error}
          <br />
          Please check the GitHub API connection.
        </div>
      </div>
    );
  }
  
  return null;
}
