
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, MapPin, Clock, ExternalLink, Building, ArrowLeft, SearchX, Edit3 } from 'lucide-react';
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
  onBackToPreferences: () => void;
}

const JobMatchingModal: React.FC<JobMatchingModalProps> = ({
  open,
  onOpenChange,
  passport,
  normalizedSocials,
  jobPreferences,
  onBackToPreferences
}) => {
  const { data: jobs = [], isLoading, error: queryError } = useQuery({
    queryKey: ['matched-jobs', passport?.owner_address, jobPreferences],
    queryFn: async () => {
      if (!jobPreferences) return [];
      
      console.log('Fetching jobs with preferences:', jobPreferences);
      
      const allJobs = await jobsApi.getAllJobs();
      console.log('Total jobs fetched:', allJobs.length);
      
      const filteredJobs = allJobs.filter(job => {
        const locationMatch = jobPreferences.country.toLowerCase() === 'remote' || 
                             job.location.toLowerCase().includes(jobPreferences.country.toLowerCase()) ||
                             job.location.toLowerCase().includes('remote') ||
                             (jobPreferences.country.toLowerCase().includes('uk') || jobPreferences.country.toLowerCase().includes('united kingdom')) &&
                             (job.location.toLowerCase().includes('uk') || job.location.toLowerCase().includes('united kingdom') || job.location.toLowerCase().includes('london') || job.location.toLowerCase().includes('manchester') || job.location.toLowerCase().includes('birmingham'));
        
        const typeMatch = jobPreferences.jobType.toLowerCase() === 'any' ||
                         job.type.toLowerCase().includes(jobPreferences.jobType.toLowerCase()) ||
                         job.location.toLowerCase().includes(jobPreferences.jobType.toLowerCase()) ||
                         (jobPreferences.jobType.toLowerCase() === 'full-time' && (job.type.toLowerCase().includes('full') || job.location.toLowerCase().includes('full'))) ||
                         (jobPreferences.jobType.toLowerCase() === 'part-time' && (job.type.toLowerCase().includes('part') || job.location.toLowerCase().includes('part'))) ||
                         (jobPreferences.jobType.toLowerCase() === 'remote' && job.location.toLowerCase().includes('remote'));
        
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
      return filteredJobs.slice(0, 20);
    },
    enabled: open && !!jobPreferences
  });

  const formatSalary = (salary: string) => {
    return salary.replace('£', '£').replace(' per annum', '/year').replace(' per month', '/month').replace(' per day', '/day');
  };

  const profileName = passport?.name || 'your profile';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-gray-50 border-0 shadow-2xl rounded-none overflow-hidden flex flex-col">
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
                Job Matches for {profileName}
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
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse border bg-white border-gray-200 shadow-sm rounded-lg">
                  <CardHeader className="pb-3">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : queryError ? (
             <Card className="p-8 sm:p-12 text-center bg-white border-dashed border-2 border-red-200 rounded-xl shadow-lg">
                <SearchX className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-red-400 mb-4 sm:mb-6" />
                <h3 className="text-xl sm:text-2xl font-bold text-red-700 mb-3">Error Fetching Jobs</h3>
                <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
                  We encountered an issue while trying to fetch job matches. Please try again later.
                </p>
                <Button onClick={onBackToPreferences} variant="outline" className="text-red-700 border-red-300 hover:bg-red-50">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Preferences
                </Button>
              </Card>
          ) : jobs.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center bg-white border-dashed border-2 border-gray-200 rounded-xl shadow-lg">
              <SearchX className="h-16 w-16 sm:h-20 sm:w-20 mx-auto text-gray-400 mb-4 sm:mb-6" />
              <h3 className="text-xl sm:text-2xl font-bold text-gray-700 mb-3">No Job Matches Found</h3>
              <p className="text-gray-600 max-w-md mx-auto text-sm sm:text-base mb-6">
                We couldn't find any Web3 jobs matching your current preferences. Try adjusting your criteria for better results!
              </p>
              <Button onClick={onBackToPreferences} variant="default" className="bg-primary hover:bg-primary/90">
                <Edit3 className="h-4 w-4 mr-2" />
                Adjust Preferences
              </Button>
              {jobPreferences && (
                <div className="mt-6 text-xs text-gray-400">
                  <p>Searched for: {jobPreferences.country} • {jobPreferences.jobType} • {jobPreferences.sector}</p>
                </div>
              )}
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4 text-center sm:text-left">
                <p className="text-md sm:text-lg font-semibold text-blue-700">
                  Found {jobs.length} Web3 job{jobs.length !== 1 ? 's' : ''} for you
                </p>
                <p className="text-xs sm:text-sm text-blue-600 mt-1">
                  Powered by web3.career - The leading Web3 job board
                </p>
              </div>
              {jobs.map((job) => (
                <Card 
                  key={job.job_id} 
                  className="hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden group hover:border-primary"
                >
                  <CardHeader className="pb-3 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300 p-4">
                    <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg sm:text-xl text-gray-800 group-hover:text-primary transition-colors duration-300 mb-1 sm:mb-2">{job.title}</CardTitle>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            <Building className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                            <span className="font-medium text-gray-700">{job.company}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      {job.salary && job.salary.toLowerCase() !== 'n/a' && job.salary.toLowerCase() !== 'not specified' && (
                        <Badge variant="secondary" className="text-green-700 bg-green-100 border border-green-200 font-semibold text-sm sm:text-base px-3 py-1 mt-2 sm:mt-0 self-start sm:self-center">
                          {formatSalary(job.salary)}
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  
                  <CardContent className="p-4">
                    <div 
                      className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none mb-4"
                      dangerouslySetInnerHTML={{ __html: job.description.substring(0, 250) + (job.description.length > 250 ? '...' : '') }}
                    />
                    
                    {job.skills && job.skills.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills:</h4>
                        <div className="flex flex-wrap gap-2">
                          {job.skills.slice(0, 5).map((skill) => ( // Show max 5 skills initially
                            <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs font-medium">
                              {skill}
                            </Badge>
                          ))}
                          {job.skills.length > 5 && <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs font-medium">+{job.skills.length-5} more</Badge>}
                        </div>
                      </div>
                    )}
                    
                    <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500 mb-2 sm:mb-0">
                        Posted: {new Date(job.posted_date).toLocaleDateString('en-GB', { 
                          day: 'numeric', 
                          month: 'short', 
                          year: 'numeric' 
                        })}
                      </span>
                      <a 
                        href={job.apply_url}
                        target="_blank"
                        rel="noopener noreferrer follow"
                        className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
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

