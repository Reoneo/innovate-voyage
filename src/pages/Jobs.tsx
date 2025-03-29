
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import JobListings from '@/components/jobs/JobListings';
import JobFilters from '@/components/jobs/JobFilters';
import { toast } from 'sonner';
import { Briefcase, Database, Building, MapPin, Globe, Award } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from '@/components/ui/badge';
import { useAllEnsRecords, useAllSkillNfts } from '@/hooks/useWeb3';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const Jobs = () => {
  const [sortBy, setSortBy] = useState('recent');

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', sortBy],
    // Fix: The getAllJobs function doesn't expect any arguments
    queryFn: () => jobsApi.getAllJobs(),
  });

  const { data: skills, isLoading: isLoadingSkills } = useQuery({
    queryKey: ['skills'],
    queryFn: jobsApi.getUniqueSkills,
  });

  const { data: jobTypes } = useQuery({
    queryKey: ['jobTypes'],
    queryFn: jobsApi.getJobTypes,
  });

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: jobsApi.getLocations,
  });

  const { data: sectors } = useQuery({
    queryKey: ['sectors'],
    queryFn: () => Promise.resolve([
      "Technology", 
      "Healthcare", 
      "Engineering", 
      "Finance", 
      "Education", 
      "Public Sector", 
      "Private Sector", 
      "Non-profit"
    ]),
  });

  // Web3 credentials data
  const { data: ensRecords, isLoading: isLoadingEns } = useAllEnsRecords();
  const { data: skillNfts, isLoading: isLoadingNfts } = useAllSkillNfts();

  if (error) {
    toast.error('Failed to load job listings');
  }

  // Stats for jobs
  const statsData = React.useMemo(() => {
    if (!jobs) return null;
    
    return {
      total: jobs.length,
      remoteJobs: jobs.filter(job => 
        job.location.toLowerCase().includes('remote')).length,
      contractJobs: jobs.filter(job => 
        job.type === 'Contract').length,
      companiesCount: new Set(jobs.map(job => job.company)).size
    };
  }, [jobs]);

  const handleSortChange = (value: string) => {
    setSortBy(value);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Briefcase className="h-8 w-8 text-primary" />
              Job Opportunities
            </h1>
            <p className="text-muted-foreground mt-1">
              Find your next Web3 position with blockchain-verified credentials
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
                    <Database className="h-4 w-4" />
                    <span>{statsData?.total || 0} positions</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Total available positions</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {statsData && (
              <>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
                        <MapPin className="h-4 w-4" />
                        <span>{statsData.remoteJobs} remote</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Remote positions available</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
                        <Building className="h-4 w-4" />
                        <span>{statsData.companiesCount} companies</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Unique companies hiring</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </>
            )}
          </div>
        </div>

        {/* Web3 Credentials Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Web3 Talent Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingEns ? (
              <p>Loading profiles...</p>
            ) : (
              ensRecords?.slice(0, 3).map((record) => (
                <Card key={record.address}>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={record.avatar} alt={record.ensName} />
                      <AvatarFallback>{record.ensName.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle>{record.ensName}</CardTitle>
                      <CardDescription className="truncate">{record.address}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1">
                        <Award className="h-4 w-4" /> Skills
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {record.skills.map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <JobFilters 
              skills={skills || []} 
              jobTypes={jobTypes || []} 
              locations={locations || []}
              sectors={sectors}
              isLoading={isLoadingSkills}
            />
          </div>
          <div className="lg:col-span-3">
            <JobListings 
              jobs={jobs || []} 
              isLoading={isLoading} 
              sortBy={sortBy}
              onSortChange={handleSortChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
