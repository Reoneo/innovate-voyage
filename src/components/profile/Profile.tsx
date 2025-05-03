
import React from 'react';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';

interface ProfileData {
  username: string;
  bio: string;
  avatar?: string;
  socials?: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    [key: string]: string | undefined;
  };
}

const fetcher = (url: string) =>
  fetch(url).then(res => {
    if (!res.ok) throw new Error(res.statusText);
    return res.json();
  });

export function Profile({ userId }: { userId: string }) {
  const { data, error } = useSWR<ProfileData>(`/api/profile/${userId}`, fetcher);

  if (error) return (
    <div className="p-4 border border-red-200 bg-red-50 text-red-700 rounded-lg">
      Error: {error.message}
    </div>
  );

  if (!data) return (
    <div className="space-y-3">
      <Skeleton className="h-12 w-1/2" />
      <Skeleton className="h-24 w-full" />
    </div>
  );

  // Extract GitHub username if available
  const githubUsername = data.socials?.github ? 
    data.socials.github.split('/').pop() || '' : '';

  return (
    <div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow-md">
      <div className="flex flex-col md:flex-row gap-4">
        <Avatar className="h-16 w-16">
          {data.avatar ? (
            <img src={data.avatar} alt={data.username} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-primary-100 flex items-center justify-center text-lg font-bold text-primary">
              {data.username.charAt(0).toUpperCase()}
            </div>
          )}
        </Avatar>
        <div>
          <h2 className="text-xl font-bold">{data.username}</h2>
          <p className="text-gray-600">{data.bio}</p>
        </div>
      </div>
      
      {/* GitHub Contributions */}
      {githubUsername && (
        <div className="w-full overflow-hidden rounded-lg border mt-2">
          <div className="p-3 border-b bg-gray-50">
            <h3 className="font-medium text-sm flex items-center gap-1">
              <svg viewBox="0 0 16 16" width="14" height="14" fill="currentColor">
                <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z"></path>
              </svg>
              GitHub Contributions
            </h3>
          </div>
          <iframe
            title="GitHub contributions"
            src={`https://github.com/users/${githubUsername}/contributions`}
            style={{ border: 0, width: '100%', height: '120px' }}
            sandbox="allow-scripts allow-same-origin"
            loading="lazy"
          />
        </div>
      )}
    </div>
  );
}

export function ProfileDialog({ userId, open, onOpenChange }: { 
  userId: string; 
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
        </DialogHeader>
        <Profile userId={userId} />
      </DialogContent>
    </Dialog>
  );
}
