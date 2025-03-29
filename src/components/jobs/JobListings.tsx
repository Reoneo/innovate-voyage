
import React from 'react';
import { Job } from '@/types/job';
import JobCard from './JobCard';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from '@/components/ui/button';
import { SlidersHorizontal } from 'lucide-react';

interface JobListingsProps {
  jobs: Job[];
  isLoading: boolean;
  sortBy?: string;
  onSortChange?: (value: string) => void;
}

const JobListings: React.FC<JobListingsProps> = ({ 
  jobs, 
  isLoading, 
  sortBy = 'recent',
  onSortChange 
}) => {
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
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-muted-foreground">
          Showing <span className="font-medium text-foreground">{jobs.length}</span> results
        </p>
        
        <div className="flex items-center gap-2">
          <Select 
            value={sortBy} 
            onValueChange={onSortChange}
          >
            <SelectTrigger className="w-[180px] h-9">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="salary-high">Highest Salary</SelectItem>
              <SelectItem value="salary-low">Lowest Salary</SelectItem>
              <SelectItem value="relevance">Relevance</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="space-y-4">
        {jobs.map((job) => (
          <JobCard key={job.job_id} job={job} />
        ))}
      </div>
    </div>
  );
};

export default JobListings;
