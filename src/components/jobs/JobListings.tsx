
import React from 'react';
import { Job } from '@/types/job';
import JobCard from './JobCard';
import { Skeleton } from '@/components/ui/skeleton';

interface JobListingsProps {
  jobs: Job[];
  isLoading: boolean;
}

const JobListings: React.FC<JobListingsProps> = ({ jobs, isLoading }) => {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="rounded-lg border p-4 animate-pulse">
            <Skeleton className="h-6 w-1/3 mb-2" />
            <Skeleton className="h-4 w-1/4 mb-4" />
            <Skeleton className="h-16 w-full mb-4" />
            <div className="flex flex-wrap gap-2 mb-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-6 w-16 rounded-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-28" />
          </div>
        ))}
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No job listings found</h3>
        <p className="text-muted-foreground mt-1">Try adjusting your search filters</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.job_id} job={job} />
      ))}
    </div>
  );
};

export default JobListings;
