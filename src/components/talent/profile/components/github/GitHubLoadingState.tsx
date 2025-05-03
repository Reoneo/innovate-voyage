
import React from 'react';

interface GitHubLoadingStateProps {
  loading: boolean;
  error: string | null;
}

export default function GitHubLoadingState({ loading, error }: GitHubLoadingStateProps) {
  if (loading) {
    return <div className="text-sm text-gray-500">Loading GitHub activity graph...</div>;
  }
  
  if (error) {
    return <div className="text-sm text-red-500">Error: {error}</div>;
  }
  
  return null;
}
