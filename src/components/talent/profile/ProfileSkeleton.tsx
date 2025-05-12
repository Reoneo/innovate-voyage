
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 pt-16 bg-white">
      <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto">
        {/* Left column */}
        <div className="w-full md:w-1/3 space-y-6">
          {/* Avatar and name */}
          <div className="flex flex-col items-center space-y-4">
            <Skeleton className="h-32 w-32 rounded-full" />
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-5 w-36" />
            <Skeleton className="h-4 w-64" />
          </div>
          
          {/* Social links */}
          <div className="flex flex-wrap justify-center gap-2">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-8 rounded-full" />
            ))}
          </div>
          
          {/* Bio */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
        </div>
        
        {/* Right column */}
        <div className="w-full md:w-2/3 space-y-8">
          {/* Talent score */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-40" />
            <div className="flex gap-4">
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-16 w-1/3" />
              <Skeleton className="h-16 w-1/3" />
            </div>
          </div>
          
          {/* GitHub contributions */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-40 w-full" />
          </div>
          
          {/* Onchain Activity */}
          <div className="space-y-4">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSkeleton;
