
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ExternalLink, Building } from 'lucide-react';
import { Job } from '@/types/job';
import { jobsApi } from '@/api/jobsApi';
import { useQuery } from '@tanstack/react-query';
import { JobPreferences } from './JobPreferencesModal';

interface JobMatchingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  passport: any;
  normalizedSocials: Record<string, string>;
  jobPreferences: JobPreferences | null;
}

const JobMatchingModal: React.FC<JobMatchingModalProps> = ({
  open,
  onOpenChange,
  passport,
  normalizedSocials,
  jobPreferences
}) => {
  // Fetch matched jobs based on user preferences
  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ['matched-jobs', passport?.owner_address, jobPreferences],
    queryFn: async () => {
      if (!jobPreferences) return [];
      
      const allJobs = await jobsApi.getAllJobs();
      
      // Filter jobs based on user preferences
      return allJobs.filter(job => {
        const locationMatch = jobPreferences.country === 'Remote' || 
                             job.location.toLowerCase().includes(jobPreferences.country.toLowerCase()) ||
                             job.location.toLowerCase().includes('remote');
        
        const typeMatch = job.type.toLowerCase() === jobPreferences.jobType.toLowerCase();
        
        // Simple sector matching - you could make this more sophisticated
        const sectorMatch = job.title.toLowerCase().includes(jobPreferences.sector.toLowerCase()) ||
                           job.description.toLowerCase().includes(jobPreferences.sector.toLowerCase());
        
        return locationMatch && typeMatch && sectorMatch;
      }).slice(0, 6); // Limit to 6 matches
    },
    enabled: open && !!jobPreferences
  });

  const formatSalary = (salary: string) => {
    return salary.replace('£', '£').replace(' per annum', '/year').replace(' per month', '/month');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Matches for {passport?.name || 'You'}
            {jobPreferences && (
              <div className="ml-2 flex gap-1">
                <Badge variant="outline">{jobPreferences.country}</Badge>
                <Badge variant="outline">{jobPreferences.jobType}</Badge>
                <Badge variant="outline">{jobPreferences.sector}</Badge>
              </div>
            )}
          </DialogTitle>
        </DialogHeader>
        
        <div className="mt-4">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-8 text-center">
              <Briefcase className="h-12 w-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Job Matches Found</h3>
              <p className="text-gray-600">
                We couldn't find any jobs matching your selected preferences. 
                Try adjusting your criteria or check back later for new opportunities!
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {jobs.map((job) => (
                <Card key={job.job_id} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-lg text-gray-900">{job.title}</CardTitle>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4" />
                            {job.company}
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {job.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {job.type}
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-100">
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-4 leading-relaxed">
                      {job.description}
                    </p>
                    
                    <div className="mb-4">
                      <h4 className="text-sm font-semibold text-gray-900 mb-2">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">
                        Posted: {new Date(job.posted_date).toLocaleDateString()}
                      </span>
                      <Button 
                        onClick={() => window.open(job.apply_url, '_blank')}
                        className="flex items-center gap-2"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatchingModal;
