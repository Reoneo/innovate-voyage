
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Github } from 'lucide-react';
import GitHubCalendar from 'react-github-calendar';

interface GitHubDialogContentProps {
  username: string;
}

const GitHubDialogContent: React.FC<GitHubDialogContentProps> = ({
  username
}) => {
  const theme = {
    light: ['#ffffff', '#d6d6d6', '#969696', '#545454', '#000000']
  };

  const githubProfileUrl = `https://github.com/${username}`;

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Github className="w-6 h-6" />
          GitHub Contributions
        </DialogTitle>
      </DialogHeader>
      
      <div className="space-y-6 pt-4">
        <div className="text-center">
          <a 
            href={githubProfileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            @{username}
          </a>
        </div>
        
        <div className="w-full overflow-x-auto">
          <div className="w-full flex justify-center" style={{ minWidth: '650px' }}>
            <GitHubCalendar 
              username={username} 
              colorScheme="light" 
              theme={theme} 
              hideColorLegend={false} 
              hideMonthLabels={false} 
              showWeekdayLabels={true} 
              blockSize={10} 
              blockMargin={3} 
              blockRadius={2} 
              fontSize={12} 
              labels={{
                months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                weekdays: ['', 'Mon', '', 'Wed', '', 'Fri', ''],
                totalCount: '{{count}} contributions'
              }} 
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default GitHubDialogContent;
