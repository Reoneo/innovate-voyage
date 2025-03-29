
import React, { useState } from 'react';
import { Search, X, Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useQueryClient } from '@tanstack/react-query';
import { jobsApi } from '@/api/jobsApi';
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';

interface JobFiltersProps {
  skills: string[];
  jobTypes: string[];
  locations: string[];
  isLoading: boolean;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  skills, 
  jobTypes, 
  locations,
  isLoading
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');

  const handleSearch = () => {
    queryClient.fetchQuery({
      queryKey: ['jobs'],
      queryFn: () => jobsApi.searchJobs({
        search: searchTerm,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        type: selectedType || undefined,
        location: selectedLocation || undefined
      })
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedType('');
    setSelectedLocation('');
    queryClient.fetchQuery({
      queryKey: ['jobs'],
      queryFn: jobsApi.getAllJobs
    });
  };

  const handleSkillChange = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const renderLoading = () => (
    <div className="space-y-4">
      <Skeleton className="h-8 w-full mb-4" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-4 w-3/5" />
    </div>
  );

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-4">
        <h3 className="font-medium text-sm text-muted-foreground mb-2">FILTER JOBS</h3>
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search jobs..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSearch} className="flex-1">
            <Filter className="mr-2 h-4 w-4" />
            Apply Filters
          </Button>
          <Button variant="outline" size="icon" onClick={handleClearFilters}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {isLoading ? renderLoading() : (
          <Accordion type="multiple" defaultValue={["skills", "jobType", "location"]} className="w-full">
            <AccordionItem value="jobType">
              <AccordionTrigger className="text-sm font-medium">Job Type</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {jobTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        checked={selectedType === type}
                        onCheckedChange={() => 
                          setSelectedType(prev => prev === type ? '' : type)
                        }
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">
                        {type}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="skills">
              <AccordionTrigger className="text-sm font-medium">Skills</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {skills.map((skill) => (
                    <div key={skill} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`skill-${skill}`} 
                        checked={selectedSkills.includes(skill)}
                        onCheckedChange={() => handleSkillChange(skill)}
                      />
                      <Label htmlFor={`skill-${skill}`} className="text-sm cursor-pointer">
                        {skill}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="location">
              <AccordionTrigger className="text-sm font-medium">Location</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2">
                  {locations.map((location) => (
                    <div key={location} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`location-${location}`} 
                        checked={selectedLocation === location}
                        onCheckedChange={() => 
                          setSelectedLocation(prev => prev === location ? '' : location)
                        }
                      />
                      <Label htmlFor={`location-${location}`} className="text-sm cursor-pointer">
                        {location}
                      </Label>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default JobFilters;
