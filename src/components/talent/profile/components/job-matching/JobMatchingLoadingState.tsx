
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

const JobMatchingLoadingState: React.FC = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <Card key={i} className="border bg-white border-gray-200 shadow-sm rounded-lg">
          <CardHeader className="pb-3">
            <Skeleton className="h-5 w-3/4 mb-2 bg-gray-200" />
            <Skeleton className="h-4 w-1/2 bg-gray-200" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Skeleton className="h-4 bg-gray-200 rounded" />
              <Skeleton className="h-4 w-5/6 bg-gray-200 rounded" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default JobMatchingLoadingState;
