
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
            
            // Enhance the grid appearance
            const gridContainer = calendar.querySelector('.js-calendar-graph-svg');
            if (gridContainer) {
              gridContainer.setAttribute('style', 'stroke: rgba(255, 255, 255, 0.1); stroke-width: 1px;');
            }
            
            // Find the text elements showing month names and make them more visible
            const textElements = calendar.querySelectorAll('text.month');
            textElements.forEach((text) => {
              text.setAttribute('fill', '#FFFFFF');
              text.setAttribute('font-weight', '600');
            });
            
            // Find the weekday text elements and make them more visible
            const weekdayElements = calendar.querySelectorAll('text.wday');
            weekdayElements.forEach((text) => {
              text.setAttribute('fill', '#FFFFFF');
              text.setAttribute('font-weight', '600');
            });
            
            // Add styling to the contribution squares
            const squares = calendar.querySelectorAll('.day');
            squares.forEach((square: Element) => {
              const level = square.getAttribute('data-level');
              if (level) {
                square.classList.add(`contribution-level-${level}`);
                
                // Add grid effect to squares
                const rect = square as SVGRectElement;
                rect.setAttribute('stroke', 'rgba(0, 0, 0, 0.2)');
                rect.setAttribute('stroke-width', '1');
              }
            });
            
            // Style the contribution summary text
            const summaryText = calendar.querySelector('.contrib-number');
            if (summaryText) {
              summaryText.setAttribute('style', 'font-size: 24px; font-weight: bold; color: white;');
            }
            
            // Style the date range text
            const dateText = calendar.querySelector('.contrib-footer .float-left');
            if (dateText) {
              dateText.setAttribute('style', 'color: rgba(255, 255, 255, 0.7); margin-top: 4px;');
            }
            
            // Add a distinctive border to the calendar
            calendar.classList.add('border-white/10', 'border');
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
    <div className="w-full overflow-hidden mt-4 min-h-[230px] flex flex-col justify-center">
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
          
          {/* Streaks and Stats Display */}
          <div className="mt-4 grid grid-cols-3 gap-4 py-3 border-t border-white/10 text-center">
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Contributions in the last year</span>
              <span className="text-2xl font-bold mt-1" id={`${username}-total-contrib`}>-</span>
              <span className="text-xs text-gray-500 mt-1" id={`${username}-date-range`}>-</span>
            </div>
            
            <div className="flex flex-col border-x border-white/10">
              <span className="text-sm text-gray-400">Longest streak</span>
              <span className="text-2xl font-bold mt-1" id={`${username}-longest-streak`}>- days</span>
              <span className="text-xs text-gray-500 mt-1">Rock - Hard Place</span>
            </div>
            
            <div className="flex flex-col">
              <span className="text-sm text-gray-400">Current streak</span>
              <span className="text-2xl font-bold mt-1" id={`${username}-current-streak`}>- days</span>
              <span className="text-xs text-gray-500 mt-1">Rock - Hard Place</span>
            </div>
          </div>
          
          <div className="mt-4 text-right">
            <a 
              href={`https://github.com/${username}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:underline text-sm flex items-center justify-end"
            >
              View GitHub Profile <ExternalLink className="ml-1 h-3 w-3" />
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
