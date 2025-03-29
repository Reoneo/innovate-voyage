import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import JobListings from '@/components/jobs/JobListings';
import JobFilters from '@/components/jobs/JobFilters';
import { toast } from 'sonner';
import { Briefcase, Database, Building, MapPin, Globe, Award, Shield, Star, Info } from 'lucide-react';
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
import { truncateAddress, calculateHumanScore, getScoreColorClass, BlockchainPassport, PassportSkill } from '@/lib/utils';

const Jobs = () => {
  const [sortBy, setSortBy] = useState('recent');

  const { data: jobs, isLoading, error } = useQuery({
    queryKey: ['jobs', sortBy],
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

  const { data: ensRecords, isLoading: isLoadingEns } = useAllEnsRecords();
  const { data: skillNfts, isLoading: isLoadingNfts } = useAllSkillNfts();

  if (error) {
    toast.error('Failed to load job listings');
  }

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

  const passportData = React.useMemo(() => {
    if (!ensRecords) return [];
    
    return ensRecords.map(record => {
      const passport: BlockchainPassport = {
        passport_id: record.ensName,
        owner_address: record.address,
        avatar_url: record.avatar,
        name: record.ensName.split('.')[0],
        issued: new Date(Date.now() - Math.random() * 63072000000).toISOString(),
        socials: record.socialProfiles,
        skills: record.skills.map(skill => ({
          name: skill,
          proof: Math.random() > 0.5 ? `ipfs://QmProof${skill.replace(/\s/g, '')}` : undefined,
          issued_by: Math.random() > 0.7 ? ['Ethereum Foundation', 'Encode Club', 'Consensys', 'ETHGlobal'][Math.floor(Math.random() * 4)] : undefined
        }))
      };

      const { score, category } = calculateHumanScore(passport);
      
      return {
        ...passport,
        score,
        category,
        colorClass: getScoreColorClass(score),
        hasMoreSkills: passport.skills.length > 4
      };
    }).sort((a, b) => b.score - a.score);
  }, [ensRecords]);

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

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
            <Globe className="h-6 w-6 text-primary" />
            Web3 Talent Network
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingEns ? (
              <p>Loading profiles...</p>
            ) : (
              passportData.slice(0, 3).map((passport) => (
                <Card key={passport.owner_address} className="overflow-hidden">
                  <CardHeader className="flex flex-row items-center gap-4 pb-2">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={passport.avatar_url} alt={passport.passport_id} />
                      <AvatarFallback>{passport.passport_id.substring(0, 2)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <CardTitle>{passport.passport_id}</CardTitle>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center gap-1">
                                <Shield className={`h-4 w-4 ${passport.colorClass}`} />
                                <span className={`font-bold ${passport.colorClass}`}>{passport.score}</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p><span className="font-bold">{passport.category}</span> - Human Reliability Score</p>
                              <p className="text-xs text-muted-foreground">Based on blockchain credentials</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <CardDescription className="truncate">{truncateAddress(passport.owner_address)}</CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-2">
                      <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
                        <Award className="h-4 w-4" /> Skills
                      </h4>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {passport.skills?.slice(0, 4).map((skill, idx) => (
                          <Badge 
                            key={`${skill.name}-${idx}`} 
                            variant={skill.proof ? "default" : "secondary"} 
                            className="text-xs"
                          >
                            {skill.proof && <Star className="h-3 w-3 mr-1" />}
                            {skill.name}
                          </Badge>
                        ))}
                        {passport.hasMoreSkills && (
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Badge variant="outline" className="text-xs cursor-help">
                                  <Info className="h-3 w-3 mr-1" />
                                  +{passport.skills.length - 4} more
                                </Badge>
                              </TooltipTrigger>
                              <TooltipContent className="w-64 p-2">
                                <p className="font-medium mb-1">Additional Skills:</p>
                                <div className="flex flex-wrap gap-1">
                                  {passport.skills?.slice(4).map((skill, idx) => (
                                    <Badge 
                                      key={`more-${skill.name}-${idx}`} 
                                      variant={skill.proof ? "default" : "secondary"} 
                                      className="text-xs"
                                    >
                                      {skill.proof && <Star className="h-3 w-3 mr-1" />}
                                      {skill.name}
                                    </Badge>
                                  ))}
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        )}
                      </div>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      <span className="font-medium">Human Score:</span> {passport.category}
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
