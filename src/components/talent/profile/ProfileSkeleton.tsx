
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="flex flex-col md:flex-row gap-8">
        {/* Avatar and left column skeleton */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start gap-4">
          <Skeleton className="w-32 h-32 rounded-full" />
          <Skeleton className="w-32 h-6 rounded" />
          <Skeleton className="w-48 h-4 rounded" />
          <Skeleton className="w-full h-24 rounded mt-4" />
          <div className="w-full grid grid-cols-4 gap-2 mt-4">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Right column skeleton */}
        <div className="md:w-2/3">
          <Skeleton className="w-full h-8 rounded mb-4" />
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <Skeleton className="w-2/3 h-6 rounded mb-2" />
              <Skeleton className="w-full h-4 rounded mb-1" />
              <Skeleton className="w-full h-4 rounded mb-1" />
              <Skeleton className="w-3/4 h-4 rounded" />
            </div>
          ))}
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileSkeleton;
