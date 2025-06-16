
import React from 'react';
import JobMatchingLoadingState from './JobMatchingLoadingState';
import JobMatchingErrorState from './JobMatchingErrorState';
import JobMatchingEmptyState from './JobMatchingEmptyState';
import JobCard from './JobCard';
import { Job } from '@/types/job';
import { JobPreferences } from './JobPreferencesModal';

interface JobListProps {
    isLoading: boolean;
    queryError: Error | null;
    jobs: Job[];
    onBackToPreferences: () => void;
    jobPreferences: JobPreferences | null;
    totalJobs: number;
}

const JobList: React.FC<JobListProps> = ({ isLoading, queryError, jobs, onBackToPreferences, jobPreferences, totalJobs }) => {
    if (isLoading) {
        return <JobMatchingLoadingState />;
    }

    if (queryError) {
        return <JobMatchingErrorState onRetry={onBackToPreferences} />;
    }

    if (totalJobs === 0) {
        return <JobMatchingEmptyState onAdjustPreferences={onBackToPreferences} jobPreferences={jobPreferences} />;
    }

    return (
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 text-center sm:text-left">
            <p className="text-md sm:text-lg font-semibold text-blue-700">
              Found {totalJobs} Web3 job{totalJobs !== 1 ? 's' : ''}
            </p>
            <p className="text-xs sm:text-sm text-blue-600 mt-1">
              Powered by web3.career - The leading Web3 job board
            </p>
          </div>
          {jobs.map((job) => (
            <JobCard key={job.job_id} job={job} />
          ))}
        </div>
    );
};

export default JobList;
