
import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, ExternalLink } from 'lucide-react';

export default function TokenInvalidAlert() {
  return (
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
  );
}
