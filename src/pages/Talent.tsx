
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { web3Api } from '@/api/web3Api';
import { Shield, Users, Star, Info, Filter, Award } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { truncateAddress, calculateHumanScore, getScoreColorClass, BlockchainPassport } from '@/lib/utils';
import UserCardTooltip from '@/components/jobs/UserCardTooltip';
import { useAllEnsRecords, useAllSkillNfts } from '@/hooks/useWeb3';

const Talent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('score');

  const { data: ensRecords, isLoading: isLoadingEns } = useAllEnsRecords();
  const { data: skillNfts, isLoading: isLoadingNfts } = useAllSkillNfts();

  // Extract all unique skills from passports
  const allSkills = React.useMemo(() => {
    if (!ensRecords) return [];
    
    const skillsSet = new Set<string>();
    ensRecords.forEach(record => {
      record.skills.forEach(skill => skillsSet.add(skill));
    });
    
    return Array.from(skillsSet).sort();
  }, [ensRecords]);

  // Process passport data and apply filters
  const passportData = React.useMemo(() => {
    if (!ensRecords) return [];
    
    // Create full passport objects with scores
    const passports = ensRecords.map(record => {
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
    });

    // Apply filters
    return passports
      .filter(passport => {
        // Search filter
        if (searchTerm) {
          const searchLower = searchTerm.toLowerCase();
          const matchesSearch = 
            passport.passport_id.toLowerCase().includes(searchLower) ||
            passport.owner_address.toLowerCase().includes(searchLower) ||
            passport.skills.some(skill => skill.name.toLowerCase().includes(searchLower));
          
          if (!matchesSearch) return false;
        }
        
        // Skills filter
        if (selectedSkills.length > 0) {
          const hasSelectedSkills = selectedSkills.some(skill => 
            passport.skills.some(s => s.name === skill)
          );
          
          if (!hasSelectedSkills) return false;
        }
        
        return true;
      })
      .sort((a, b) => {
        // Sorting
        if (sortBy === 'score') {
          return b.score - a.score;
        } else if (sortBy === 'name') {
          return a.passport_id.localeCompare(b.passport_id);
        } else {
          return b.score - a.score; // Default
        }
      });
  }, [ensRecords, searchTerm, selectedSkills, sortBy]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0 mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <Users className="h-8 w-8 text-primary" />
              Web3 Talent Network
            </h1>
            <p className="text-muted-foreground mt-1">
              Discover blockchain-verified professionals with on-chain credentials
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <div className="text-sm text-muted-foreground bg-secondary/50 backdrop-blur-sm p-2 rounded-lg">
              <span>{passportData.length} profiles</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Filters */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter Talent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Search</h3>
                  <Input
                    placeholder="Search by name or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Sort By</h3>
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="score">Highest Score</SelectItem>
                      <SelectItem value="name">Name (A-Z)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-sm font-medium">Skills</h3>
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-7 gap-1">
                          <Filter className="h-3.5 w-3.5" />
                          <span className="text-xs">All Skills</span>
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filter by Skills</SheetTitle>
                          <SheetDescription>
                            Select the skills you want to filter by
                          </SheetDescription>
                        </SheetHeader>
                        <div className="grid grid-cols-1 gap-2 py-4 max-h-[70vh] overflow-y-auto">
                          {allSkills.map((skill) => (
                            <div key={skill} className="flex items-center space-x-2">
                              <Checkbox 
                                id={`skill-${skill}`} 
                                checked={selectedSkills.includes(skill)}
                                onCheckedChange={() => handleSkillToggle(skill)}
                              />
                              <Label htmlFor={`skill-${skill}`}>{skill}</Label>
                            </div>
                          ))}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {selectedSkills.map(skill => (
                      <Badge 
                        key={skill} 
                        variant="outline"
                        className="cursor-pointer"
                        onClick={() => handleSkillToggle(skill)}
                      >
                        {skill}
                        <button 
                          className="ml-1 rounded-full hover:bg-background/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSkillToggle(skill);
                          }}
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                  {(selectedSkills.length > 0 || searchTerm) && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={clearFilters}
                      className="w-full text-xs"
                    >
                      Clear Filters
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Talent Grid */}
          <div className="lg:col-span-3">
            {isLoadingEns ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Card key={i} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-full" />
                        <div className="flex flex-wrap gap-1">
                          {Array.from({ length: 4 }).map((_, i) => (
                            <Skeleton key={i} className="h-6 w-16 rounded-full" />
                          ))}
                        </div>
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : passportData.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Users className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No profiles found</h3>
                <p className="text-muted-foreground">
                  Try adjusting your filters or search criteria
                </p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {passportData.map((passport) => (
                  <Card key={passport.owner_address} className="overflow-hidden">
                    <CardHeader className="flex flex-row items-center gap-4 pb-2">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={passport.avatar_url} alt={passport.passport_id} />
                        <AvatarFallback>{passport.passport_id.substring(0, 2)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <CardTitle>{passport.passport_id}</CardTitle>
                          <HoverCard>
                            <HoverCardTrigger asChild>
                              <div className="flex items-center gap-1 cursor-help">
                                <Shield className={`h-4 w-4 ${passport.colorClass}`} />
                                <span className={`font-bold ${passport.colorClass}`}>{passport.score}</span>
                              </div>
                            </HoverCardTrigger>
                            <UserCardTooltip passport={passport} />
                          </HoverCard>
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
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Talent;
