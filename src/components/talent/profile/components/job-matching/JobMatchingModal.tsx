
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ExternalLink, Building, X } from 'lucide-react';
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
      const threeDaysAgo = new Date();
      threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
      
      // Filter jobs based on user preferences and 3-day listing
      return allJobs.filter(job => {
        // Check if job was posted in the last 3 days
        const jobPostedDate = new Date(job.posted_date);
        const isRecentlyPosted = jobPostedDate >= threeDaysAgo;
        
        // Location matching - more flexible
        const locationMatch = jobPreferences.country === 'Remote' || 
                             job.location.toLowerCase().includes(jobPreferences.country.toLowerCase()) ||
                             job.location.toLowerCase().includes('remote') ||
                             job.location.toLowerCase().includes('uk') ||
                             job.location.toLowerCase().includes('united kingdom');
        
        // Job type matching - more flexible
        const typeMatch = job.type.toLowerCase().includes(jobPreferences.jobType.toLowerCase()) ||
                         jobPreferences.jobType.toLowerCase().includes(job.type.toLowerCase()) ||
                         (jobPreferences.jobType.toLowerCase() === 'full-time' && job.type.toLowerCase() === 'full-time') ||
                         (jobPreferences.jobType.toLowerCase() === 'part-time' && job.type.toLowerCase() === 'part-time');
        
        // Sector matching - expanded to check multiple fields
        const sectorLower = jobPreferences.sector.toLowerCase();
        const sectorMatch = job.title.toLowerCase().includes(sectorLower) ||
                           job.description.toLowerCase().includes(sectorLower) ||
                           job.company.toLowerCase().includes(sectorLower) ||
                           job.skills.some(skill => skill.toLowerCase().includes(sectorLower)) ||
                           (sectorLower === 'technology' && (
                             job.title.toLowerCase().includes('developer') ||
                             job.title.toLowerCase().includes('engineer') ||
                             job.title.toLowerCase().includes('tech') ||
                             job.skills.some(skill => ['react', 'javascript', 'python', 'node', 'css'].includes(skill.toLowerCase()))
                           ));
        
        return isRecentlyPosted && locationMatch && typeMatch && sectorMatch;
      }).slice(0, 10); // Show up to 10 matches
    },
    enabled: open && !!jobPreferences
  });

  const formatSalary = (salary: string) => {
    return salary.replace('£', '£').replace(' per annum', '/year').replace(' per month', '/month').replace(' per day', '/day');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto bg-white">
        <DialogHeader className="relative border-b pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
            <Briefcase className="h-6 w-6 text-primary" />
            Job Matches for {passport?.name || 'You'} (Last 3 Days)
            {jobPreferences && (
              <div className="ml-2 flex gap-1">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">{jobPreferences.country}</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">{jobPreferences.jobType}</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">{jobPreferences.sector}</Badge>
              </div>
            )}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-8 w-8"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <div className="mt-6">
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
            <Card className="p-8 text-center bg-gray-50 border-dashed">
              <Briefcase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Recent Job Matches Found</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                We couldn't find any jobs matching your selected preferences that were posted in the last 3 days. 
                Try adjusting your criteria or check back later for new opportunities!
              </p>
              {jobPreferences && (
                <div className="mt-4 text-sm text-gray-400">
                  <p>Searched for: {jobPreferences.country} • {jobPreferences.jobType} • {jobPreferences.sector}</p>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700 font-medium">
                  Found {jobs.length} job{jobs.length !== 1 ? 's' : ''} matching your preferences posted in the last 3 days
                </p>
              </div>
              {jobs.map((job) => (
                <Card key={job.job_id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-gray-900 mb-2">{job.title}</CardTitle>
                        <div className="flex items-center gap-6 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4 text-primary" />
                            <span className="font-medium">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-primary" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-primary" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-100 font-semibold text-base px-3 py-1">
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-6 leading-relaxed text-base">
                      {job.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-sm font-semibold text-gray-900 mb-3">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-gray-50 text-gray-700 border-gray-300">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-4 border-t">
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(job.posted_date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <Button 
                        onClick={() => window.open(job.apply_url, '_blank')}
                        className="flex items-center gap-2 bg-primary hover:bg-primary/90"
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
