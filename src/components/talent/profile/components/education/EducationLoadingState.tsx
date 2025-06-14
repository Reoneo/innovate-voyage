
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

const EducationLoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2].map((index) => (
        <div key={index} className="border rounded-lg p-4">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-3 w-32 mb-1" />
              <Skeleton className="h-3 w-24" />
            </div>
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex items-center gap-4 mb-3">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-3 w-16" />
          </div>
          <div className="flex gap-2">
            <Skeleton className="h-5 w-12" />
            <Skeleton className="h-5 w-16" />
            <Skeleton className="h-5 w-14" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default EducationLoadingState;
