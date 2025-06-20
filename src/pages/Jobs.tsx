import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import JobListings from '@/components/jobs/JobListings';
import JobFilters from '@/components/jobs/JobFilters';
import { toast } from '@/hooks/use-toast';
import { Briefcase, Database, Building, MapPin, Home, Filter, CalendarDays } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Jobs = () => {
  const [sortBy, setSortBy] = useState('recent'); // Client-side sorting for now
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<string[]>([]); // For generic filters like "remote", "fulltime"
  const [activeSkillFilters, setActiveSkillFilters] = useState<string[]>([]);
  const [selectedDateFilter, setSelectedDateFilter] = useState<string>('any'); // 'any', '24h', '3d', '7d', '14d', '30d'

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', searchQuery, activeFilters, activeSkillFilters, selectedDateFilter, sortBy],
    queryFn: () => {
      const searchParams: Parameters<typeof jobsApi.searchJobs>[0] = {
        search: searchQuery,
        skills: activeSkillFilters,
      };

      if (selectedDateFilter !== 'any') {
        const daysMap: Record<string, number> = {
          '24h': 1,
          '3d': 3,
          '7d': 7,
          '14d': 14,
          '30d': 30,
        };
        searchParams.postedWithinDays = daysMap[selectedDateFilter];
      }

      if (activeFilters.includes('remote')) {
        searchParams.location = 'remote';
      }
      if (activeFilters.includes('fulltime')) {
        searchParams.type = 'Full-Time'; // Ensure this matches the format in your job data
      }
      // "high-paying" and "entry-level" filters are not implemented in jobsApi.searchJobs
      // They will not have an effect with the current API.

      return jobsApi.searchJobs(searchParams);
    },
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

  if (error) {
    toast({ // Using object format for shadcn toast
      title: "Error",
      description: "Failed to load job listings. Please try again later.",
      variant: "destructive",
    });
  }

  const statsData = useMemo(() => {
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

  const toggleFilter = (filter: string) => {
    setActiveFilters(prevFilters => 
      prevFilters.includes(filter)
        ? prevFilters.filter(f => f !== filter)
        : [...prevFilters, filter]
    );
  };

  const toggleSkillFilter = (skill: string) => {
    setActiveSkillFilters(prev =>
      prev.includes(skill) ? prev.filter(s => s !== skill) : [...prev, skill]
    );
  };

  const handleDateFilterChange = (value: string) => {
    setSelectedDateFilter(value);
  };
  
  const clearAllFilters = () => {
    setSearchQuery('');
    setActiveFilters([]);
    setActiveSkillFilters([]);
    setSelectedDateFilter('any');
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
          
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="outline" className="flex items-center gap-2">
                <Home className="h-4 w-4" />
                Home
              </Button>
            </Link>
            
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
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <JobFilters 
              skills={skills || []} 
              jobTypes={jobTypes || []} 
              locations={locations || []}
              sectors={sectors}
              isLoading={isLoadingSkills}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              activeFilters={activeFilters}
              toggleFilter={toggleFilter}
              activeSkillFilters={activeSkillFilters}
              toggleSkillFilter={toggleSkillFilter}
              selectedDateFilter={selectedDateFilter}
              onDateFilterChange={handleDateFilterChange}
              clearAllFilters={clearAllFilters}
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
