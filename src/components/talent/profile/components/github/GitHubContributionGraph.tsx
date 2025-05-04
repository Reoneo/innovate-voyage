
import React, { useEffect, useRef, useState } from 'react';
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

export default function GitHubContributionGraph({
  username
}: GitHubContributionProps) {
  const {
    loading,
    error,
    tokenInvalid,
    stats,
    fetchGitHubContributions
  } = useGitHubContributions(username);
  const calendarRef = useRef<HTMLDivElement>(null);
  const [totalContributions, setTotalContributions] = useState<number | null>(null);

  // Fetch GitHub contribution count directly from GitHub profile page
  useEffect(() => {
    if (username && !loading && !error) {
      const fetchContributions = async () => {
        try {
          const response = await fetch(`https://github.com/${username}`);
          const html = await response.text();
          
          // Create a temporary element to parse the HTML
          const parser = new DOMParser();
          const doc = parser.parseFromString(html, 'text/html');
          
          // Find the contribution count element
          const contribHeader = doc.querySelector('h2.f4.text-normal.mb-2');
          if (contribHeader) {
            const text = contribHeader.textContent || '';
            const match = text.match(/(\d+,?\d*) contributions/);
            if (match && match[1]) {
              // Remove commas and convert to number
              const count = parseInt(match[1].replace(/,/g, ''), 10);
              setTotalContributions(count);
              console.log(`Found ${count} contributions for ${username}`);
            }
          } else {
            console.log('Could not find contribution count element on GitHub page');
          }
        } catch (err) {
          console.error('Error fetching GitHub contribution count:', err);
        }
      };
      
      fetchContributions();
    }
  }, [username, loading, error]);

  // Effect to initialize GitHub Calendar when the component mounts or username changes
  useEffect(() => {
    // Only try to initialize if we have a username and the component is mounted
    if (!loading && !error && username && calendarRef.current && window.GitHubCalendar) {
      try {
        console.log(`Initializing GitHub Calendar for ${username}`);

        // Apply the GitHub Calendar with dark theme and responsive options
        window.GitHubCalendar(`.github-calendar-${username}`, username, {
          responsive: true,
          global_stats: false, // We'll display stats in our custom format
          tooltips: true,
          summary_text: '',
          dark_theme: true
        });

        // Apply custom styling to match the reference image after a short delay
        setTimeout(() => {
          const calendar = document.querySelector(`.github-calendar-${username}`);
          if (calendar) {
            // Add dark theme styles
            calendar.classList.add('github-calendar-dark');

            // Find all day squares and add grid styling
            const squares = calendar.querySelectorAll('.day');
            squares.forEach((square: Element) => {
              // Add grid effect to all squares - improved grid styling
              const rect = square as SVGRectElement;
              rect.setAttribute('stroke', 'rgba(27, 31, 35, 0.6)');
              rect.setAttribute('stroke-width', '1');
              rect.setAttribute('rx', '2');
              rect.setAttribute('ry', '2');
            });

            // Update contribution stats display based on fetched data
            if (totalContributions !== null) {
              const totalContribDisplay = document.getElementById(`${username}-total-contrib`);
              if (totalContribDisplay) {
                totalContribDisplay.textContent = totalContributions.toString();
              }
            }

            // Update date range
            try {
              const dateRangeElement = calendar.querySelector('.contrib-footer .float-left');
              if (dateRangeElement) {
                const dateRange = dateRangeElement.textContent || "";
                const dateDisplay = document.getElementById(`${username}-date-range`);
                if (dateDisplay) {
                  dateDisplay.textContent = dateRange.trim();
                }
              }
            } catch (err) {
              console.error('Error extracting GitHub date range:', err);
            }
          }
        }, 500);
      } catch (err) {
        console.error('Error initializing GitHub Calendar:', err);
      }
    }
  }, [username, loading, error, totalContributions]);

  // If no username provided, don't show anything
  if (!username) {
    console.log('No GitHub username provided to GitHubContributionGraph');
    return null;
  }

  return (
    <div className="w-full overflow-hidden mt-4">
      <GitHubLoadingState loading={loading} error={error} />
      
      {tokenInvalid && <Alert variant="destructive" className="mb-4">
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
        </Alert>}
      
      {!loading && !error && username && (
        <div className="github-calendar-wrapper">
          {/* Contribution count header */}
          <div className="contributions-header flex items-center justify-between mb-4">
            <h3 className="text-xl font-medium text-gray-200">
              <span id={`${username}-total-contrib`}>{totalContributions !== null ? totalContributions : (stats.total || 0)}</span> contributions in the last year
            </h3>
            <div className="contribution-settings text-gray-400 text-sm">
              Contribution settings ▼
            </div>
          </div>
          
          {/* Container for GitHub Calendar */}
          <div className="calendar-container min-h-[180px] rounded-lg overflow-hidden">
            <div ref={calendarRef} className={`github-calendar-${username} github-calendar-graph`}>
              {/* Loading message shown until the library loads the calendar */}
              Loading GitHub contribution data...
            </div>
          </div>
          
          {/* Legend and info section */}
          <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
            <a href="https://docs.github.com/articles/why-are-my-contributions-not-showing-up-on-my-profile" 
               target="_blank" 
               rel="noopener noreferrer"
               className="hover:text-gray-300 hover:underline">
              Learn how we count contributions
            </a>
            
            <div className="contribution-legend flex items-center gap-1">
              <span>Less</span>
              <div className="legend-item h-3 w-3 bg-[#161b22] rounded-sm border border-[#1e262f]"></div>
              <div className="legend-item h-3 w-3 bg-[#0e4429] rounded-sm"></div>
              <div className="legend-item h-3 w-3 bg-[#006d32] rounded-sm"></div>
              <div className="legend-item h-3 w-3 bg-[#26a641] rounded-sm"></div>
              <div className="legend-item h-3 w-3 bg-[#39d353] rounded-sm"></div>
              <span>More</span>
            </div>
          </div>
          
          {/* Stats Display - Now hidden as per new design */}
          <div className="github-stats-container hidden">
            <div className="github-stat-item">
              <span className="github-stat-title">Contributions in the last year</span>
              <span className="github-stat-value" id={`${username}-total-contrib`}>{totalContributions !== null ? totalContributions : (stats.total || 0)}</span>
              <span className="github-stat-subtitle" id={`${username}-date-range`}>May 5, 2024 – May 4, 2025</span>
            </div>
            
            <div className="github-stat-item">
              <span className="github-stat-title">Longest streak</span>
              <span className="github-stat-value" id={`${username}-longest-streak`}>{stats.longestStreak || 0} days</span>
              <span className="github-stat-subtitle">Rock - Hard Place</span>
            </div>
            
            <div className="github-stat-item">
              <span className="github-stat-title">Current streak</span>
              <span className="github-stat-value" id={`${username}-current-streak`}>{stats.currentStreak || 0} days</span>
              <span className="github-stat-subtitle">Rock - Hard Place</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
