
import React from 'react';
import GitHubContributionGraph from './GitHubContributionGraph';

interface GitHubContributionsProps {
  username: string;
  isVerified: boolean;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username, isVerified }) => {
  // Early return if no username or not verified
  if (!username || !isVerified) return null;
  
  // Extract GitHub username from full URL if needed (e.g., "https://github.com/octocat" -> "octocat")
  const gitHubUsername = username.includes('github.com/') 
    ? username.split('github.com/').pop() 
    : username;
  
  console.log('GitHub Username:', gitHubUsername);

  return <GitHubContributionGraph username={gitHubUsername || ''} />;
};

export default GitHubContributions;

// Export these for backward compatibility if they're used elsewhere
export const GitHubContributionsSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
      <div className="p-4 border-b">
        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse"></div>
      </div>
      <div className="p-4">
        <div className="h-28 w-full bg-gray-200 rounded animate-pulse"></div>
      </div>
    </div>
  );
};

export const GitHubContributionsError = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-red-200 bg-red-50 text-red-700 shadow mb-4 p-4">
      <div className="flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
        </svg>
        <span>Failed to load GitHub contributions. Please try again later.</span>
      </div>
    </div>
  );
};
