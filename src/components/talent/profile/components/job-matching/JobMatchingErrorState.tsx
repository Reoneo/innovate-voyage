
import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { SearchX, ArrowLeft } from 'lucide-react';

interface JobMatchingErrorStateProps {
  onRetry: () => void;
}

const JobMatchingErrorState: React.FC<JobMatchingErrorStateProps> = ({ onRetry }) => {
  return (
    <Card className="p-8 sm:p-12 text-center bg-white border-dashed border-2 border-red-200 rounded-xl shadow-lg">
      <SearchX className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-red-400 mb-4 sm:mb-6" />
      <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-3">Error Fetching Jobs</h3>
      <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
        We encountered an issue while trying to fetch job matches. Please try again later or adjust your preferences.
      </p>
      <Button onClick={onRetry} variant="outline" className="text-red-700 border-red-300 hover:bg-red-50">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Preferences
      </Button>
    </Card>
  );
};

export default JobMatchingErrorState;
