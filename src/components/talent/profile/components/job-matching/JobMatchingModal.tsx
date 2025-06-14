
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { jobsApi } from '@/api/jobsApi';
import { useQuery } from '@tanstack/react-query';
import { JobPreferences } from './JobPreferencesModal';
import JobMatchingHeader from './JobMatchingHeader';
import DateFilter from './DateFilter';
import JobList from './JobList';

interface JobMatchingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPreferences: JobPreferences | null;
  onBackToPreferences: () => void;
}

const JobMatchingModal: React.FC<JobMatchingModalProps> = ({
  open,
  onOpenChange,
  jobPreferences,
  onBackToPreferences
}) => {
  const [dateFilter, setDateFilter] = React.useState('any');

  const { data: jobs = [], isLoading, error: queryError } = useQuery({
    queryKey: ['all-jobs', dateFilter],
    queryFn: async () => {
      console.log('Fetching jobs with date filter:', dateFilter);
      
      const daysMap: Record<string, number> = {
        '24h': 1,
        '3d': 3,
        '7d': 7,
        '14d': 14,
        '30d': 30,
      };
      const days = dateFilter !== 'any' ? daysMap[dateFilter] : undefined;
      
      const jobs = await jobsApi.searchJobs({ postedWithinDays: days });
      console.log('Total jobs fetched:', jobs.length);
      
      return jobs;
    },
    enabled: open
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-gray-50 border-0 shadow-2xl rounded-none overflow-hidden flex flex-col">
        <JobMatchingHeader 
          onBackToPreferences={onBackToPreferences}
          jobPreferences={jobPreferences}
        />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <DateFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} />

          <JobList 
            isLoading={isLoading}
            queryError={queryError as Error | null}
            jobs={jobs}
            onBackToPreferences={onBackToPreferences}
            jobPreferences={jobPreferences}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatchingModal;
