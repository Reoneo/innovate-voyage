
import React, { useState, useEffect } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface GitHubContributionsProps {
  username: string;
  isVerified: boolean;
}

const GitHubContributions: React.FC<GitHubContributionsProps> = ({ username, isVerified }) => {
  const [useImageFallback, setUseImageFallback] = useState(false);
  const [errorLoading, setErrorLoading] = useState(false);
  
  if (!username || !isVerified) return null;
  
  // Log the URL to help with debugging
  const contributionsUrl = `https://github.com/users/${username}/contributions`;
  console.log('GitHub Contributions URL:', contributionsUrl);

  return (
    <div className="relative w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
      <div className="p-4 border-b">
        <h3 className="font-medium text-lg flex items-center gap-2">
          <svg viewBox="0 0 16 16" width="16" height="16" fill="currentColor" className="mt-0.5">
            <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
          </svg>
          GitHub Contributions
        </h3>
      </div>

      <div className="overflow-auto py-2">
        {errorLoading || useImageFallback ? (
          // Image fallback approach
          <img
            alt={`${username}'s GitHub contributions`}
            src={contributionsUrl}
            style={{
              display: 'block',
              width: '100%',
              height: '120px',
              objectFit: 'contain',
              border: 0
            }}
            onError={() => {
              setErrorLoading(true);
              console.error('Failed to load GitHub contributions image');
            }}
          />
        ) : (
          // Primary iframe approach
          <iframe
            title="GitHub contributions"
            src={contributionsUrl}
            style={{ 
              border: '0', 
              width: '100%', 
              height: '120px',
              display: 'block'
            }}
            loading="lazy"
            onError={(e) => {
              console.error('Failed to load GitHub contributions iframe');
              setUseImageFallback(true); // Try image fallback if iframe fails
            }}
          />
        )}
      </div>
    </div>
  );
};

export const GitHubContributionsSkeleton = () => {
  return (
    <div className="w-full overflow-hidden rounded-lg border bg-white shadow mb-4">
      <div className="p-4 border-b">
        <Skeleton className="h-6 w-48" />
      </div>
      <div className="p-4">
        <Skeleton className="h-28 w-full" />
      </div>
    </div>
  );
};

export const GitHubContributionsError = () => {
  return (
    <Alert variant="destructive" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>
        Failed to load GitHub contributions. Please try again later.
      </AlertDescription>
    </Alert>
  );
};

export default GitHubContributions;
