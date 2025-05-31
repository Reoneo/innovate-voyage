
import React from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, AlertTriangle } from 'lucide-react';

interface GitHubContributionsProps {
  username: string;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username }) => {
  return (
    <div className="space-y-4">
      <Alert className="border-yellow-200 bg-yellow-50">
        <Shield className="h-4 w-4 text-yellow-600" />
        <AlertDescription className="text-yellow-800">
          <strong>Security Enhancement:</strong> GitHub API integration has been temporarily disabled for security reasons. 
          API keys have been removed from the frontend code to prevent exposure.
        </AlertDescription>
      </Alert>
      
      <Alert className="border-blue-200 bg-blue-50">
        <AlertTriangle className="h-4 w-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          To re-enable GitHub contributions, implement a secure backend proxy service that handles API authentication server-side.
        </AlertDescription>
      </Alert>
    </div>
  );
};

export default GitHubContributions;
