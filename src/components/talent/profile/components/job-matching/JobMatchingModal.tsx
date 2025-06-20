
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, ArrowLeft, CalendarDays } from 'lucide-react';
import { Job } from '@/types/job';
import { jobsApi } from '@/api/jobsApi';
import { useQuery } from '@tanstack/react-query';
import { JobPreferences } from './JobPreferencesModal';
import JobCard from './JobCard';
import JobMatchingLoadingState from './JobMatchingLoadingState';
import JobMatchingErrorState from './JobMatchingErrorState';
import JobMatchingEmptyState from './JobMatchingEmptyState';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';

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
  const [dateFilter, setDateFilter] = React.useState('any');

  const { data: jobs = [], isLoading, error: queryError, refetch } = useQuery({
    queryKey: ['matched-jobs', passport?.owner_address, jobPreferences, dateFilter],
    queryFn: async () => {
      if (!jobPreferences) return [];
      
      console.log('Fetching jobs with preferences:', jobPreferences, 'and date filter:', dateFilter);
      
      const allJobs = await jobsApi.getAllJobs();
      console.log('Total jobs fetched:', allJobs.length);

      const sectorKeywords: Record<string, string[]> = {
        technology: ['developer', 'engineer', 'tech', 'software', 'blockchain', 'web3', 'react', 'javascript', 'python', 'node', 'css', 'solidity', 'defi', 'nft', 'data scientist'],
        finance: ['finance', 'financial', 'fintech', 'defi', 'accounting', 'analyst', 'trading', 'quant'],
        healthcare: ['health', 'medical', 'clinic', 'doctor', 'nurse', 'pharma', 'biotech'],
        education: ['education', 'teacher', 'learning', 'edutech', 'research'],
        marketing: ['marketing', 'growth', 'seo', 'content', 'social media', 'community', 'brand'],
        design: ['design', 'designer', 'ui', 'ux', 'figma', 'sketch', 'product designer'],
        engineering: ['engineer', 'engineering', 'mechanical', 'electrical', 'civil', 'hardware', 'platform'],
        sales: ['sales', 'business development', 'bd', 'account executive', 'partnerships']
      };
      
      const filteredJobs = allJobs.filter(job => {
        const locationMatch = jobPreferences.country.toLowerCase() === 'remote' || 
                             job.location.toLowerCase().includes(jobPreferences.country.toLowerCase()) ||
                             job.location.toLowerCase().includes('remote') ||
                             (jobPreferences.country.toLowerCase().includes('uk') || jobPreferences.country.toLowerCase().includes('united kingdom')) &&
                             (job.location.toLowerCase().includes('uk') || job.location.toLowerCase().includes('united kingdom') || job.location.toLowerCase().includes('london') || job.location.toLowerCase().includes('manchester') || job.location.toLowerCase().includes('birmingham'));
        
        const jobTypeLower = jobPreferences.jobType.toLowerCase();
        const typeMatch = jobTypeLower === 'any' ||
                         job.type.toLowerCase().includes(jobTypeLower) ||
                         (jobTypeLower === 'remote' && job.location.toLowerCase().includes('remote')) ||
                         (jobTypeLower === 'full-time' && job.type.toLowerCase().includes('full')) ||
                         (jobTypeLower === 'part-time' && job.type.toLowerCase().includes('part'));
        
        const sectorLower = jobPreferences.sector.toLowerCase();
        let sectorMatch = sectorLower === 'any';

        if (!sectorMatch) {
          const keywords = sectorKeywords[sectorLower] || [sectorLower];
          const jobText = `${job.title.toLowerCase()} ${job.description.toLowerCase()} ${job.skills.join(' ').toLowerCase()}`;
          
          sectorMatch = keywords.some(keyword => jobText.includes(keyword));
        }

        let dateMatch = true;
        if (dateFilter !== 'any') {
          const daysMap: Record<string, number> = {
            '24h': 1,
            '3d': 3,
            '7d': 7,
            '14d': 14,
            '30d': 30,
          };
          const days = daysMap[dateFilter];
          if (days) {
            const NdaysAgo = new Date();
            NdaysAgo.setDate(NdaysAgo.getDate() - days);
            const NdaysAgoString = NdaysAgo.toISOString().split('T')[0];
            dateMatch = job.posted_date >= NdaysAgoString;
          }
        }
        
        const match = locationMatch && typeMatch && sectorMatch && dateMatch;
        
        if (match) {
          console.log('Job matched:', {
            title: job.title,
            location: job.location,
            type: job.type,
            skills: job.skills,
            posted_date: job.posted_date,
            locationMatch,
            typeMatch,
            sectorMatch,
            dateMatch,
            preferences: jobPreferences,
            dateFilter: dateFilter
          });
        }
        
        return match;
      });
      
      console.log('Filtered jobs count:', filteredJobs.length);
      return filteredJobs.slice(0, 20);
    },
    enabled: open && !!jobPreferences
  });

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
          <div className="mb-4 max-w-xs">
            <Label htmlFor="date-filter" className="text-sm font-medium mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Date Posted
            </Label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger id="date-filter" className="w-full">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="3d">Last 3 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <JobMatchingLoadingState />
          ) : queryError ? (
             <JobMatchingErrorState onRetry={onBackToPreferences} />
          ) : jobs.length === 0 ? (
            <JobMatchingEmptyState onAdjustPreferences={onBackToPreferences} jobPreferences={jobPreferences} />
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
                <JobCard key={job.job_id} job={job} />
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatchingModal;
