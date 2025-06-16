
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchX, Edit3 } from 'lucide-react';
import { JobPreferences } from './JobPreferencesModal';

interface JobMatchingEmptyStateProps {
  onAdjustPreferences: () => void;
  jobPreferences: JobPreferences | null;
}

const JobMatchingEmptyState: React.FC<JobMatchingEmptyStateProps> = ({ onAdjustPreferences, jobPreferences }) => {
  return (
    <Card className="p-8 sm:p-12 text-center bg-white border-dashed border-2 border-gray-200 rounded-xl shadow-lg">
      <SearchX className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 mb-4 sm:mb-6" />
      <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">No Job Matches Found</h3>
      <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
        We couldn't find any Web3 jobs matching your current preferences. Try adjusting your criteria for better results!
      </p>
      <Button onClick={onAdjustPreferences} variant="default" className="bg-primary hover:bg-primary/90">
        <Edit3 className="h-4 w-4 mr-2" />
        Adjust Preferences
      </Button>
      {jobPreferences && (
        <div className="mt-6 text-xs text-gray-400">
          <p>Searched for: {jobPreferences.country} • {jobPreferences.jobType} • {jobPreferences.sector}</p>
        </div>
      )}
    </Card>
  );
};

export default JobMatchingEmptyState;
