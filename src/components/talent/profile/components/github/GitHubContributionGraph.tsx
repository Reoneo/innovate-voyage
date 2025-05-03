
import React from 'react';
import { GitHubContributionProps } from './types';
import { useGitHubContributions } from './useGitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import ContributionGrid from './ContributionGrid';
import { useTalentProtocolGithub } from '@/hooks/useTalentProtocolGithub';
import { useScoresData } from '@/hooks/useScoresData';

export default function GitHubContributionGraph({ username }: GitHubContributionProps) {
  const { contributionData, loading, error, yearlyTotal } = useGitHubContributions(username);
  const walletAddress = window.localStorage.getItem('connectedWalletAddress') || undefined;
  const { isVerified, verifiedUsername, loading: verificationLoading } = useTalentProtocolGithub(
    walletAddress,
    username
  );
  
  // Get GitHub score breakdown
  const { githubPoints, loading: scoreLoading } = useScoresData(walletAddress || '');
  
  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  // Show loading state during verification or score check
  if (verificationLoading || scoreLoading) {
    return <GitHubLoadingState loading={true} error={null} />;
  }

  // Only show the graph if GitHub points are greater than zero
  if (githubPoints !== undefined && githubPoints <= 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-900 rounded-lg p-4">
        <div className="text-amber-500 font-medium mb-2">GitHub contributions disabled</div>
        <div className="text-xs text-gray-400 text-center">
          GitHub contributions can be displayed after earning GitHub points on Talent Protocol.
        </div>
      </div>
    );
  }

  // Only show the graph if the GitHub account is verified
  if (!isVerified) {
    return (
      <div className="flex flex-col items-center justify-center h-40 w-full bg-gray-900 rounded-lg p-4">
        <div className="text-amber-500 font-medium mb-2">GitHub account not verified</div>
        <div className="text-xs text-gray-400 text-center">
          This GitHub account needs to be verified through Talent Protocol before displaying contributions.
        </div>
      </div>
    );
  }

  return (
    <div 
      className="w-full overflow-x-auto mt-4 min-h-[200px] flex flex-col justify-center"
    >
      <GitHubLoadingState loading={loading} error={error} />
      
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
            {verifiedUsername && username === verifiedUsername && (
              <span className="bg-green-800 text-green-100 text-xs px-2 py-0.5 rounded-full">Verified</span>
            )}
            {githubPoints !== undefined && githubPoints > 0 && (
              <span className="bg-blue-800 text-blue-100 text-xs px-2 py-0.5 rounded-full">
                {githubPoints} GitHub points
              </span>
            )}
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
