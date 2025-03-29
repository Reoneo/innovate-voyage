
import React, { useState } from 'react';
import { Search, X, Filter, SlidersHorizontal } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface JobFiltersProps {
  skills: string[];
  jobTypes: string[];
  locations: string[];
  sectors?: string[];
  salaryCurrencies?: string[];
  securityClearances?: string[];
  workModes?: string[];
  isLoading: boolean;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  skills, 
  jobTypes, 
  locations,
  sectors = ["Technology", "Healthcare", "Engineering", "Finance", "Education", "Public Sector", "Private Sector", "Non-profit"],
  salaryCurrencies = ["GBP (£)", "USD ($)", "EUR (€)"],
  securityClearances = ["None", "Basic", "Secret", "Top Secret"],
  workModes = ["Remote", "Hybrid", "On-site"],
  isLoading
}) => {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSector, setSelectedSector] = useState<string>('');
  const [selectedSalaryRange, setSelectedSalaryRange] = useState({ min: '', max: '' });
  const [selectedCurrency, setSelectedCurrency] = useState<string>('GBP (£)');
  const [selectedWorkMode, setSelectedWorkMode] = useState<string>('');
  const [selectedClearance, setSelectedClearance] = useState<string>('');
  const [showContractRoles, setShowContractRoles] = useState<boolean>(false);

  const handleSearch = () => {
    queryClient.fetchQuery({
      queryKey: ['jobs'],
      queryFn: () => jobsApi.searchJobs({
        search: searchTerm,
        skills: selectedSkills.length > 0 ? selectedSkills : undefined,
        type: selectedType || undefined,
        location: selectedLocation || undefined,
        sector: selectedSector || undefined,
        salary: selectedSalaryRange.min || selectedSalaryRange.max 
          ? { min: selectedSalaryRange.min, max: selectedSalaryRange.max, currency: selectedCurrency }
          : undefined,
        workMode: selectedWorkMode || undefined,
        securityClearance: selectedClearance || undefined,
        contractOnly: showContractRoles
      })
    });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedSkills([]);
    setSelectedType('');
    setSelectedLocation('');
    setSelectedSector('');
    setSelectedSalaryRange({ min: '', max: '' });
    setSelectedCurrency('GBP (£)');
    setSelectedWorkMode('');
    setSelectedClearance('');
    setShowContractRoles(false);
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

  const activeFiltersCount = [
    searchTerm,
    ...selectedSkills,
    selectedType,
    selectedLocation,
    selectedSector,
    selectedSalaryRange.min,
    selectedSalaryRange.max,
    selectedWorkMode !== '',
    selectedClearance !== '',
    showContractRoles
  ].filter(Boolean).length;

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-medium text-sm text-muted-foreground">FILTER JOBS</h3>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>

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
          <Accordion type="multiple" defaultValue={["sector", "salary", "jobType", "workMode", "skills", "location", "clearance"]} className="w-full">
            <AccordionItem value="sector">
              <AccordionTrigger className="text-sm font-medium">Sector</AccordionTrigger>
              <AccordionContent>
                <Select 
                  value={selectedSector} 
                  onValueChange={setSelectedSector}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Sectors</SelectItem>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>
                        {sector}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="salary">
              <AccordionTrigger className="text-sm font-medium">Salary</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-3">
                  <div className="flex flex-col space-y-1.5">
                    <Label htmlFor="salary-currency">Currency</Label>
                    <Select 
                      value={selectedCurrency} 
                      onValueChange={setSelectedCurrency}
                    >
                      <SelectTrigger id="salary-currency">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {salaryCurrencies.map((currency) => (
                          <SelectItem key={currency} value={currency}>
                            {currency}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="min-salary">Min Salary</Label>
                      <Input 
                        id="min-salary" 
                        type="number" 
                        placeholder="0" 
                        value={selectedSalaryRange.min}
                        onChange={(e) => setSelectedSalaryRange(prev => ({ ...prev, min: e.target.value }))}
                      />
                    </div>
                    <div className="flex flex-col space-y-1.5">
                      <Label htmlFor="max-salary">Max Salary</Label>
                      <Input 
                        id="max-salary" 
                        type="number" 
                        placeholder="∞" 
                        value={selectedSalaryRange.max}
                        onChange={(e) => setSelectedSalaryRange(prev => ({ ...prev, max: e.target.value }))}
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2 pt-2">
                    <Switch 
                      id="contract-roles"
                      checked={showContractRoles}
                      onCheckedChange={setShowContractRoles}
                    />
                    <Label htmlFor="contract-roles">Show contract roles only</Label>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>

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

            <AccordionItem value="workMode">
              <AccordionTrigger className="text-sm font-medium">Work Mode</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {workModes.map((mode) => (
                    <div key={mode} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`mode-${mode}`} 
                        checked={selectedWorkMode === mode}
                        onCheckedChange={() => 
                          setSelectedWorkMode(prev => prev === mode ? '' : mode)
                        }
                      />
                      <Label htmlFor={`mode-${mode}`} className="text-sm cursor-pointer">
                        {mode}
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

            <AccordionItem value="clearance">
              <AccordionTrigger className="text-sm font-medium">Security Clearance</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-2">
                  {securityClearances.map((clearance) => (
                    <div key={clearance} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`clearance-${clearance}`} 
                        checked={selectedClearance === clearance}
                        onCheckedChange={() => 
                          setSelectedClearance(prev => prev === clearance ? '' : clearance)
                        }
                      />
                      <Label htmlFor={`clearance-${clearance}`} className="text-sm cursor-pointer">
                        {clearance}
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
