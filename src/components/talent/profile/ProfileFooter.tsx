
import React from 'react';
import GitHubContributionGraph from './components/github/GitHubContributionGraph';

interface ProfileFooterProps {
  githubUsername: string | null;
}

const ProfileFooter: React.FC<ProfileFooterProps> = ({ githubUsername }) => {
  // Only render if GitHub username is available
  if (!githubUsername) return null;

  return (
    <div className="mt-6 w-full bg-gray-950 rounded-lg shadow-md border border-gray-800">
      <div className="p-3">
        <GitHubContributionGraph 
          username={githubUsername} 
          isFooter={true} 
        />
      </div>
    </div>
  );
};

export default ProfileFooter;
