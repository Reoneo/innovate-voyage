
import React from 'react';
import HeaderContainer from './components/HeaderContainer';
import { Skeleton } from '@/components/ui/skeleton';

const ProfileSkeleton: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="flex flex-col md:flex-row gap-8 w-full pt-16">
        {/* Loading status indicator */}
        <div className="w-full mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              <div className="text-blue-700 font-medium">Loading profile data...</div>
            </div>
            <div className="mt-2 text-sm text-blue-600">
              Fetching ENS records, blockchain data, and social profiles
            </div>
          </div>
        </div>

        {/* Avatar and left column skeleton */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start gap-4">
          {/* Avatar skeleton */}
          <div className="mx-auto">
            <Skeleton className="w-48 h-48 rounded-full" />
            <div className="text-center mt-2 text-sm text-gray-500">Loading avatar...</div>
          </div>
          
          {/* Name skeleton */}
          <div className="flex flex-col items-center w-full gap-2">
            <Skeleton className="w-48 h-7 rounded" />
            <Skeleton className="w-32 h-5 rounded" />
            <div className="text-center text-sm text-gray-500">Resolving identity...</div>
          </div>
          
          {/* Contact info skeleton */}
          <div className="flex gap-2 mt-2">
            <Skeleton className="w-32 h-9 rounded-md" />
            <Skeleton className="w-32 h-9 rounded-md" />
          </div>
          
          {/* Bio skeleton */}
          <Skeleton className="w-full h-20 rounded mt-4" />
          <div className="text-center text-sm text-gray-500">Loading bio and description...</div>
          
          {/* Social icons skeleton */}
          <div className="w-full grid grid-cols-5 gap-2 mt-4 justify-center">
            {[...Array(5)].map((_, i) => (
              <Skeleton key={i} className="w-10 h-10 rounded-full" />
            ))}
          </div>
          <div className="text-center text-sm text-gray-500">Fetching social links...</div>
        </div>
        
        {/* Right column skeleton */}
        <div className="md:w-2/3">
          {/* Talent score section */}
          <Skeleton className="w-full h-20 rounded mb-6" />
          <div className="text-center text-sm text-gray-500 mb-4">Loading talent scores...</div>
          
          {/* Content sections */}
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <Skeleton className="w-3/4 h-7 rounded mb-3" />
              <div className="space-y-2">
                <Skeleton className="w-full h-16 rounded" />
                <Skeleton className="w-full h-16 rounded" />
              </div>
              {i === 0 && <div className="text-center text-sm text-gray-500 mt-2">Loading GitHub activity...</div>}
              {i === 1 && <div className="text-center text-sm text-gray-500 mt-2">Loading blockchain data...</div>}
              {i === 2 && <div className="text-center text-sm text-gray-500 mt-2">Loading additional content...</div>}
            </div>
          ))}
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileSkeleton;
