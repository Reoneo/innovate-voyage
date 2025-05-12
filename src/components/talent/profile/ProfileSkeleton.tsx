
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="flex flex-col md:flex-row gap-8 w-full pt-16">
        {/* Avatar and left column skeleton */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start gap-4">
          {/* Avatar skeleton */}
          <div className="mx-auto">
            <Skeleton className="w-48 h-48 rounded-full" />
          </div>
          
          {/* Name skeleton */}
          <div className="flex flex-col items-center w-full gap-2">
            <Skeleton className="w-48 h-7 rounded" />
            <Skeleton className="w-32 h-5 rounded" />
          </div>
          
          {/* Contact info skeleton */}
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-32 h-9 rounded-md" />
            <Skeleton className="w-32 h-9 rounded-md" />
          </div>
          
          {/* Bio skeleton */}
          <Skeleton className="w-full h-20 rounded mt-4" />
          
          {/* Social icons skeleton */}
          <div className="w-full grid grid-cols-5 gap-2 mt-4 justify-center">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* Right column skeleton */}
        <div className="md:w-2/3">
          {/* Talent score section */}
          <Skeleton className="w-full h-20 rounded mb-6" />
          
          {/* Content sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <Skeleton className="w-3/4 h-7 rounded mb-3" />
              <div className="space-y-2">
                <Skeleton className="w-full h-16 rounded" />
                <Skeleton className="w-full h-16 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileSkeleton;
