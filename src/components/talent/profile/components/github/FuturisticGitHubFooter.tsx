
import React, { useState, useEffect } from 'react';
import { useGitHubCalendar } from './hooks/useGitHubCalendar';
import { Github } from 'lucide-react';

interface FuturisticGitHubFooterProps {
  username: string;
}

const FuturisticGitHubFooter: React.FC<FuturisticGitHubFooterProps> = ({ username }) => {
  const { totalContributions, stats } = useGitHubCalendar(username);
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Add a small delay to ensure content is loaded before animation
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 600);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-b from-transparent to-black/80 py-6">
      <div className={`container transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}>
        <div className="flex flex-col items-center mb-4">
          <div className="flex items-center gap-2 text-white mb-2">
            <Github size={18} className="text-green-400" />
            <h3 className="text-lg font-semibold">GitHub Contributions</h3>
          </div>
          
          <div className="text-center mb-6">
            <div className="text-3xl font-bold text-white">{totalContributions || '0'}</div>
            <p className="text-sm text-green-400">contributions in the last year</p>
            <p className="text-xs text-gray-400 mt-1">{stats.dateRange}</p>
          </div>
        </div>
        
        <div className="w-full overflow-hidden rounded-lg bg-black/50 backdrop-blur-sm p-2 border border-green-400/30">
          <iframe 
            src={`https://github.com/users/${username}/contributions`}
            style={{ 
              width: '100%', 
              height: '120px', 
              border: 'none',
              borderRadius: '4px',
              overflow: 'hidden',
              filter: 'hue-rotate(140deg) brightness(1.1) saturate(1.2)'
            }}
            title="GitHub contributions"
            className="shadow-lg shadow-green-500/20"
          />
        </div>
      </div>
      
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-green-500/30 to-transparent"></div>
        
        {/* Animated grid lines for futuristic effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,128,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,128,0.05)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
    </div>
  );
};

export default FuturisticGitHubFooter;
