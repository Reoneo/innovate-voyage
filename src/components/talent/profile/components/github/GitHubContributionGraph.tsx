
import React, { useMemo } from 'react';
import { useGitHubContributions } from './useGitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import GitHubContributions from './GitHubContributions';

interface GitHubContributionGraphProps {
  username: string;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const { data, isLoading, error } = useGitHubContributions(username);
  
  // Skip rendering if no username provided
  if (!username) return null;

  // Memoize the year calculation to prevent unnecessary re-renders
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  return (
    <div className="p-4 bg-black rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-3">
        <div>
          <h3 className="font-medium text-white text-lg">GitHub Contributions</h3>
          <p className="text-xs text-gray-400">
            {currentYear} Calendar
          </p>
        </div>
        
        {/* GitHub username link */}
        <a 
          href={`https://github.com/${username}`}
          target="_blank"
          rel="noopener noreferrer" 
          className="text-sm text-blue-400 hover:text-blue-300 transition-colors flex items-center"
        >
          @{username}
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 20 20" 
            fill="currentColor" 
            className="w-3 h-3 ml-1"
          >
            <path fillRule="evenodd" d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z" clipRule="evenodd" />
          </svg>
        </a>
      </div>

      <div className="github-calendar-wrapper">
        {isLoading ? (
          <GitHubLoadingState />
        ) : error ? (
          <div className="text-center p-4">
            <p className="text-sm text-red-300">
              Unable to load GitHub contributions.
            </p>
          </div>
        ) : (
          <GitHubContributions 
            data={data} 
            username={username}
          />
        )}
      </div>
    </div>
  );
};

export default GitHubContributionGraph;
