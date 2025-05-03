
import React from 'react';
import useSWR from 'swr';
import { Skeleton } from '@/components/ui/skeleton';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Avatar } from '@/components/ui/avatar';

interface ProfileData {
  username: string;
  bio: string;
  avatar?: string;
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

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-md">
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
