
import React, { useEffect, useRef } from 'react';
import { GitHubContributionProps } from './types';
import { useGitHubContributions } from './useGitHubContributions';
import GitHubLoadingState from './GitHubLoadingState';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ExternalLink, AlertCircle } from 'lucide-react';

declare global {
  interface Window {
    GitHubCalendar: (selector: string, username: string, options?: any) => void;
  }
}

export default function GitHubContributionGraph({ username }: GitHubContributionProps) {
  const { loading, error, tokenInvalid } = useGitHubContributions(username);
  const calendarRef = useRef<HTMLDivElement>(null);
  
  // Effect to initialize GitHub Calendar when the component mounts or username changes
  useEffect(() => {
    // Only try to initialize if we have a username and the component is mounted
    if (!loading && !error && username && calendarRef.current && window.GitHubCalendar) {
      try {
        console.log(`Initializing GitHub Calendar for ${username}`);
        
        // Apply the GitHub Calendar with dark theme and responsive options
        window.GitHubCalendar(`.github-calendar-${username}`, username, { 
          responsive: true,
          global_stats: true,
          tooltips: true,
          summary_text: '{total} contributions in the last year'
        });
        
        // Apply custom styling to match the reference image after a short delay
        setTimeout(() => {
          const calendar = document.querySelector(`.github-calendar-${username}`);
          if (calendar) {
            // Add dark theme styles
            calendar.classList.add('github-calendar-dark');
            
            // Find all contribution squares and style them
            const squares = calendar.querySelectorAll('.day');
            squares.forEach((square) => {
              const level = square.getAttribute('data-level');
              if (level) {
                square.classList.add(`contribution-level-${level}`);
              }
            });
          }
        }, 500);
      } catch (err) {
        console.error('Error initializing GitHub Calendar:', err);
      }
    }
  }, [username, loading, error]);

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  return (
    <div className="w-full overflow-x-auto mt-4 min-h-[230px] flex flex-col justify-center">
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
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper bg-gray-950 p-4 rounded-lg">
          {/* Container for GitHub Calendar */}
          <div ref={calendarRef} className={`github-calendar-${username} calendar-container`}>
            {/* Loading message shown until the library loads the calendar */}
            Loading GitHub contribution data...
          </div>
          
          <div className="mt-4 text-right">
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-500 hover:underline"
            >
              View GitHub Profile →
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
