
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import JobListings from '@/components/jobs/JobListings';
import JobFilters from '@/components/jobs/JobFilters';
import { toast } from 'sonner';
import { Briefcase, Database } from 'lucide-react';

const Jobs = () => {
  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs'],
    queryFn: jobsApi.getAllJobs,
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: jobsApi.getUniqueSkills,
  });

  const { data: jobTypes } = useQuery({
    queryKey: ['jobTypes'],
    queryFn: jobsApi.getJobTypes,
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: jobsApi.getLocations,
  });

  if (error) {
    toast.error('Failed to load job listings');
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              Job Opportunities
            </h1>
            <p className="text-muted-foreground mt-1">
              Find your next Web3 position with blockchain-verified credentials
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
            <Database className="h-4 w-4" />
            <span>{jobs?.length || 0} positions available</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <JobFilters 
              skills={skills || []} 
              jobTypes={jobTypes || []} 
              locations={locations || []}
              isLoading={isLoadingSkills}
            />
          </div>
          <div className="lg:col-span-3">
            <JobListings jobs={jobs || []} isLoading={isLoading} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
