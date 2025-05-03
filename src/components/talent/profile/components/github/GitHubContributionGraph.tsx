
import React from 'react';
import { GitHubContributionProps } from './types';
import { useGitHubContributions } from './useGitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import ContributionGrid from './ContributionGrid';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertCircle } from 'lucide-react';

export default function GitHubContributionGraph({ username }: GitHubContributionProps) {
  const { contributionData, loading, error, yearlyTotal, tokenInvalid } = useGitHubContributions(username);
  
  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  return (
    <div 
      className="w-full overflow-x-auto mt-4 min-h-[200px] flex flex-col justify-center"
    >
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && (
        <Alert variant="destructive" className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>GitHub API Token Expired</AlertTitle>
          <AlertDescription>
            <p>Your GitHub API token has expired or been revoked.</p>
            <ol className="list-decimal ml-5 mt-2 space-y-1">
              <li>Create a new token at <a href="https://github.com/settings/tokens" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline inline-flex items-center">
                github.com/settings/tokens <ExternalLink className="h-3 w-3 ml-1" />
              </a></li>
              <li>Update your .env file with the new token</li>
              <li>Restart the local server</li>
            </ol>
          </AlertDescription>
        </Alert>
      )}
      
      {!loading && !error && contributionData && (
        <>
          <div className="flex items-center gap-2 mb-2">
            <img 
              src={contributionData.user.avatarUrl} 
              alt={`${username}'s avatar`} 
              className="w-6 h-6 rounded-full"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <span className="text-sm text-gray-300">
              {contributionData.user.name || username} • {contributionData.user.repositoriesContributedTo.totalCount} repositories
            </span>
          </div>
          
          <ContributionGrid contributionData={contributionData} />
          
          <div className="mt-2 text-right">
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View GitHub Profile →
            </a>
          </div>
        </>
      )}
    </div>
  );
}
