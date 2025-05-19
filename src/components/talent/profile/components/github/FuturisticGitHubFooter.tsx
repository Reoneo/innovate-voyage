
import React, { useEffect, useState } from 'react';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import { ChevronDown, GitHub, TrendingUp } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import GitHubContributionLegend from './components/GitHubContributionLegend';
import GitHubCalendar from 'react-github-calendar';

interface FuturisticGitHubFooterProps {
  username: string | null;
}

const FuturisticGitHubFooter: React.FC<FuturisticGitHubFooterProps> = ({ username }) => {
  const [expanded, setExpanded] = useState(false);
  const { loading, stats, totalContributions } = useGitHubCalendar(username || '');
  const [displayedTotal, setDisplayedTotal] = useState<number>(0);

  // Update displayed total when data is loaded
  useEffect(() => {
    if (totalContributions && totalContributions > 0) {
      setDisplayedTotal(totalContributions);
    } else if (stats.total > 0) {
      setDisplayedTotal(stats.total);
    }
  }, [totalContributions, stats.total]);

  if (!username) return null;

  // Futuristic theme with cyan and purple gradients
  const theme = {
    dark: [
      '#0d1117', // level0: Empty cells (dark background)
      '#0e4429', // level1: Light activity 
      '#006d32', // level2: Medium activity
      '#26a641', // level3: High activity
      '#39d353', // level4: Very high activity
    ]
  };

  const footerClass = expanded 
    ? 'fixed bottom-0 left-0 right-0 z-30 transition-all duration-500 h-64 bg-gradient-to-b from-black/80 to-black/90 backdrop-blur-lg border-t border-[#1A1F2C]/50'
    : 'fixed bottom-0 left-0 right-0 z-30 transition-all duration-500 h-20 bg-gradient-to-b from-black/70 to-black/80 backdrop-blur-lg border-t border-[#1A1F2C]/50';

  return (
    <div className={footerClass}>
      <div className="container mx-auto px-4 h-full">
        {/* Toggle header always visible */}
        <div 
          className="flex items-center justify-center py-2 cursor-pointer"
          onClick={() => setExpanded(!expanded)}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 text-white">
              <GitHub className="w-5 h-5 text-[#9b87f5]" />
              <span className="font-bold text-gradient bg-gradient-to-r from-[#9b87f5] to-[#1EAEDB] bg-clip-text text-transparent">
                GitHub Activity
              </span>
              <ChevronDown 
                className={`w-4 h-4 text-gray-400 transition-transform duration-300 ${expanded ? 'rotate-180' : ''}`} 
              />
            </div>
            
            <div className="text-white flex items-center gap-2">
              {loading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <>
                  <TrendingUp className="w-4 h-4 text-[#39d353]" />
                  <span className="font-bold text-[#39d353]">{displayedTotal}</span>
                  <span className="text-sm text-gray-300">contributions in the last year</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Expanded content */}
        {expanded && (
          <div className="pt-2 pb-4 overflow-x-auto">
            <div className="calendar-container bg-[#0d1117]/80 rounded-lg p-3 min-h-[140px] flex items-center justify-center">
              {loading ? (
                <div className="flex flex-col items-center gap-2">
                  <Skeleton className="h-[100px] w-full max-w-3xl" />
                  <span className="text-sm text-gray-400">Loading GitHub contribution data...</span>
                </div>
              ) : (
                <div className="w-full">
                  <GitHubCalendar 
                    username={username}
                    colorScheme="dark"
                    theme={theme}
                    hideColorLegend={true}
                    hideMonthLabels={false}
                    showWeekdayLabels={true}
                    blockSize={10}
                    blockMargin={2}
                    blockRadius={2}
                    fontSize={10}
                    labels={{
                      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                      weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                      totalCount: '{{count}} contributions'
                    }}
                  />
                </div>
              )}
            </div>
            <div className="mt-2 flex justify-center">
              <GitHubContributionLegend />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default FuturisticGitHubFooter;
