
import React from 'react';
import { DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ArrowLeft } from 'lucide-react';
import { JobPreferences } from './JobPreferencesModal';

interface JobMatchingHeaderProps {
  onBackToPreferences: () => void;
  jobPreferences: JobPreferences | null;
}

const JobMatchingHeader: React.FC<JobMatchingHeaderProps> = ({ onBackToPreferences, jobPreferences }) => {
  return (
    <DialogHeader className="relative border-b border-gray-200 p-4 sm:p-6 flex-shrink-0 bg-white shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-full hover:bg-gray-100 text-gray-600 hover:text-gray-800"
            onClick={onBackToPreferences}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <DialogTitle className="flex items-center gap-2 text-xl sm:text-2xl font-semibold text-gray-800">
            <Briefcase className="h-6 w-6 text-primary" />
            Job Listings
          </DialogTitle>
        </div>
        {jobPreferences && (
          <div className="hidden sm:flex items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs px-2 py-1">{jobPreferences.country}</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium text-xs px-2 py-1">{jobPreferences.jobType}</Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium text-xs px-2 py-1">{jobPreferences.sector}</Badge>
          </div>
        )}
      </div>
       {jobPreferences && (
          <div className="flex sm:hidden items-center gap-2 mt-2 justify-center">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium text-xs px-2 py-1">{jobPreferences.country}</Badge>
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium text-xs px-2 py-1">{jobPreferences.jobType}</Badge>
            <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium text-xs px-2 py-1">{jobPreferences.sector}</Badge>
          </div>
        )}
    </DialogHeader>
  );
};

export default JobMatchingHeader;
