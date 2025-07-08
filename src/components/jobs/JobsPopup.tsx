
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Search, MapPin, Building, ExternalLink } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import { Job } from '@/types/job';

const JobsPopup: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { data: jobs = [], isLoading, error } = useQuery({
    queryKey: ['web3-career-jobs', searchTerm],
    queryFn: async () => {
      const allJobs = await jobsApi.getAllJobs();
      
      if (!searchTerm) return allJobs.slice(0, 20); // Show first 20 jobs
      
      return allJobs.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      ).slice(0, 20);
    },
    enabled: open,
  });

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          Browse Web3 Jobs
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Web3 Career Jobs
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 flex-1 overflow-hidden">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="flex-1 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                <span className="ml-2">Loading jobs...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8 text-red-600">
                Error loading jobs. Please try again later.
              </div>
            ) : jobs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No jobs found matching your search.
              </div>
            ) : (
              <div className="space-y-4">
                <div className="text-sm text-muted-foreground mb-2">
                  Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''} from web3.career
                </div>
                {jobs.map((job) => (
                  <JobItem key={job.job_id} job={job} />
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const JobItem: React.FC<{ job: Job }> = ({ job }) => {
  return (
    <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg">{job.title}</h3>
        {job.salary && job.salary !== 'N/A' && (
          <Badge variant="secondary" className="text-green-700 bg-green-100">
            {job.salary}
          </Badge>
        )}
      </div>
      
      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
        <div className="flex items-center gap-1">
          <Building className="h-4 w-4" />
          {job.company}
        </div>
        <div className="flex items-center gap-1">
          <MapPin className="h-4 w-4" />
          {job.location}
        </div>
        <Badge variant="outline">{job.type}</Badge>
      </div>
      
      <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
        {job.description.replace(/<[^>]*>/g, '').substring(0, 150)}...
      </p>
      
      {job.skills.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
      )}
      
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Posted: {new Date(job.posted_date).toLocaleDateString()}
        </span>
        <a
          href={job.apply_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 bg-primary hover:bg-primary/90 text-white px-3 py-1 rounded text-sm transition-colors"
        >
          Apply <ExternalLink className="h-3 w-3" />
        </a>
      </div>
    </div>
  );
};

export default JobsPopup;
