
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
      
      console.log('Fetching jobs with preferences:', jobPreferences);
      
      const allJobs = await jobsApi.getAllJobs();
      console.log('Total jobs fetched:', allJobs.length);
      
      // Filter jobs based on user preferences
      const filteredJobs = allJobs.filter(job => {
        // Location matching - more flexible
        const locationMatch = jobPreferences.country.toLowerCase() === 'remote' || 
                             job.location.toLowerCase().includes(jobPreferences.country.toLowerCase()) ||
                             job.location.toLowerCase().includes('remote') ||
                             (jobPreferences.country.toLowerCase().includes('uk') || jobPreferences.country.toLowerCase().includes('united kingdom')) &&
                             (job.location.toLowerCase().includes('uk') || job.location.toLowerCase().includes('united kingdom') || job.location.toLowerCase().includes('london') || job.location.toLowerCase().includes('manchester') || job.location.toLowerCase().includes('birmingham'));
        
        // Job type matching - more flexible  
        const typeMatch = jobPreferences.jobType.toLowerCase() === 'any' ||
                         job.type.toLowerCase().includes(jobPreferences.jobType.toLowerCase()) ||
                         job.location.toLowerCase().includes(jobPreferences.jobType.toLowerCase()) ||
                         (jobPreferences.jobType.toLowerCase() === 'full-time' && (job.type.toLowerCase().includes('full') || job.location.toLowerCase().includes('full'))) ||
                         (jobPreferences.jobType.toLowerCase() === 'part-time' && (job.type.toLowerCase().includes('part') || job.location.toLowerCase().includes('part'))) ||
                         (jobPreferences.jobType.toLowerCase() === 'remote' && job.location.toLowerCase().includes('remote'));
        
        // Sector matching - expanded to check multiple fields
        const sectorLower = jobPreferences.sector.toLowerCase();
        const sectorMatch = sectorLower === 'any' ||
                           job.title.toLowerCase().includes(sectorLower) ||
                           job.description.toLowerCase().includes(sectorLower) ||
                           job.company.toLowerCase().includes(sectorLower) ||
                           job.skills.some(skill => skill.toLowerCase().includes(sectorLower)) ||
                           (sectorLower === 'technology' && (
                             job.title.toLowerCase().includes('developer') ||
                             job.title.toLowerCase().includes('engineer') ||
                             job.title.toLowerCase().includes('tech') ||
                             job.title.toLowerCase().includes('software') ||
                             job.title.toLowerCase().includes('blockchain') ||
                             job.title.toLowerCase().includes('web3') ||
                             job.skills.some(skill => ['react', 'javascript', 'python', 'node', 'css', 'solidity', 'blockchain', 'defi', 'nft'].includes(skill.toLowerCase()))
                           ));
        
        const match = locationMatch && typeMatch && sectorMatch;
        
        if (match) {
          console.log('Job matched:', {
            title: job.title,
            location: job.location,
            type: job.type,
            skills: job.skills,
            locationMatch,
            typeMatch,
            sectorMatch
          });
        }
        
        return match;
      });
      
      console.log('Filtered jobs count:', filteredJobs.length);
      return filteredJobs.slice(0, 20); // Show up to 20 matches
    },
    enabled: open && !!jobPreferences
  });

  const formatSalary = (salary: string) => {
    return salary.replace('£', '£').replace(' per annum', '/year').replace(' per month', '/month').replace(' per day', '/day');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto bg-white border-0 shadow-2xl">
        <DialogHeader className="relative border-b border-gray-100 pb-6">
          <DialogTitle className="flex items-center gap-3 text-2xl font-bold text-gray-900">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
              <Briefcase className="h-6 w-6 text-white" />
            </div>
            Web3 Job Matches for {passport?.name || 'You'}
            {jobPreferences && (
              <div className="ml-4 flex gap-2">
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 font-medium">{jobPreferences.country}</Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 font-medium">{jobPreferences.jobType}</Badge>
                <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200 font-medium">{jobPreferences.sector}</Badge>
              </div>
            )}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-10 w-10 rounded-full hover:bg-gray-100"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </DialogHeader>
        
        <div className="mt-8">
          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border-0 shadow-lg">
                  <CardHeader className="pb-4">
                    <div className="h-6 bg-gray-200 rounded-lg w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded-lg w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="h-4 bg-gray-200 rounded-lg"></div>
                      <div className="h-4 bg-gray-200 rounded-lg w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : jobs.length === 0 ? (
            <Card className="p-12 text-center bg-gradient-to-br from-gray-50 to-blue-50 border-dashed border-2 border-gray-200">
              <Briefcase className="h-20 w-20 mx-auto text-gray-300 mb-6" />
              <h3 className="text-2xl font-bold text-gray-700 mb-4">No Job Matches Found</h3>
              <p className="text-gray-500 max-w-md mx-auto text-lg">
                We couldn't find any Web3 jobs matching your selected preferences from the last 3 days. 
                Try adjusting your criteria or check back later for new opportunities!
              </p>
              {jobPreferences && (
                <div className="mt-6 text-sm text-gray-400">
                  <p>Searched for: {jobPreferences.country} • {jobPreferences.jobType} • {jobPreferences.sector}</p>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-6">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-6">
                <p className="text-lg font-bold text-blue-700">
                  Found {jobs.length} Web3 job{jobs.length !== 1 ? 's' : ''} matching your preferences
                </p>
                <p className="text-sm text-blue-600 mt-1">
                  Jobs powered by web3.career - the leading Web3 job board
                </p>
              </div>
              {jobs.map((job) => (
                <Card key={job.job_id} className="hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-gradient-to-br from-white to-gray-50">
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <CardTitle className="text-2xl text-gray-900 mb-3">{job.title}</CardTitle>
                        <div className="flex items-center gap-8 text-base text-gray-600">
                          <div className="flex items-center gap-2">
                            <Building className="h-5 w-5 text-primary" />
                            <span className="font-semibold">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-primary" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-5 w-5 text-primary" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <Badge variant="secondary" className="text-green-700 bg-green-100 font-bold text-lg px-4 py-2">
                        {formatSalary(job.salary)}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <p className="text-gray-700 mb-6 leading-relaxed text-base">
                      {job.description}
                    </p>
                    
                    <div className="mb-6">
                      <h4 className="text-base font-bold text-gray-900 mb-4">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-700 border-purple-300 font-medium">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex justify-between items-center pt-6 border-t border-gray-100">
                      <span className="text-sm text-gray-500">
                        Posted: {new Date(job.posted_date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        })}
                      </span>
                      <a 
                        href={job.apply_url}
                        target="_blank"
                        rel="follow"
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Apply Now
                        <ExternalLink className="h-4 w-4" />
                      </a>
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
