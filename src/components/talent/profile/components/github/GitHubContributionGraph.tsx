
import React, { useState, useEffect } from 'react';
import GitHubContributions from './GitHubContributions';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

interface GitHubContributionGraphProps {
  username: string | null;
}

const GitHubContributionGraph: React.FC<GitHubContributionGraphProps> = ({ username }) => {
  const [githubUsername, setGithubUsername] = useState<string | null>(null);
  const [isInvalidUsername, setIsInvalidUsername] = useState<boolean>(false);

  useEffect(() => {
    if (!username) {
      setIsInvalidUsername(true);
      return;
    }
    
    try {
      // Strip @ symbol if present
      let cleanUsername = username.startsWith('@') ? username.substring(1) : username;
      
      // If it's a URL, extract just the username part
      if (cleanUsername.includes('github.com')) {
        try {
          const urlObj = new URL(cleanUsername.startsWith('http') ? cleanUsername : `https://${cleanUsername}`);
          const pathParts = urlObj.pathname.split('/').filter(Boolean);
          if (pathParts.length > 0) {
            cleanUsername = pathParts[0];
          }
        } catch (error) {
          // If we can't parse as URL, just use as is
          console.error('Error parsing GitHub URL:', error);
        }
      }
      
      // Set the cleaned username if it's valid
      if (cleanUsername && cleanUsername.trim() !== '') {
        setGithubUsername(cleanUsername.trim());
        setIsInvalidUsername(false);
      } else {
        setIsInvalidUsername(true);
      }
    } catch (error) {
      console.error('Error processing GitHub username:', error);
      setIsInvalidUsername(true);
    }
  }, [username]);

  if (isInvalidUsername || !githubUsername) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg font-semibold">GitHub Contributions</CardTitle>
          <a 
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-muted-foreground hover:text-primary flex items-center"
          >
            github.com/{githubUsername} <ExternalLink className="h-3 w-3 ml-1" />
          </a>
        </div>
        <CardDescription>
          Open source contributions from {githubUsername}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <GitHubContributions username={githubUsername} />
      </CardContent>
    </Card>
  );
};

export default GitHubContributionGraph;
