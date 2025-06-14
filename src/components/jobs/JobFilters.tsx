
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Filter as FilterIcon, // Renamed to avoid conflict 
  X, 
  Book, 
  Home,
  CalendarDays
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobFiltersProps {
  setSearchQuery?: (query: string) => void;
  searchQuery?: string;
  activeFilters?: string[];
  toggleFilter?: (filter: string) => void;
  skills: string[];
  jobTypes: string[];
  locations: string[];
  sectors: string[] | undefined;
  isLoading: boolean;
  activeSkillFilters: string[]; // New prop
  toggleSkillFilter: (skill: string) => void; // New prop
  selectedDateFilter: string; // New prop
  onDateFilterChange: (value: string) => void; // New prop
  clearAllFilters: () => void; // New prop
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  setSearchQuery = () => {}, 
  searchQuery = '', 
  activeFilters = [], 
  toggleFilter = () => {},
  skills,
  // jobTypes, // Not directly used for filter UI in this version, but kept for potential future use
  // locations, // Not directly used for filter UI in this version
  // sectors, // Not directly used for filter UI in this version
  isLoading,
  activeSkillFilters,
  toggleSkillFilter,
  selectedDateFilter,
  onDateFilterChange,
  clearAllFilters
}) => {
  const dateFilterOptions = [
    { value: 'any', label: 'Any time' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '3d', label: 'Last 3 days' },
    { value: '7d', label: 'Last 7 days' },
    { value: '14d', label: 'Last 14 days' },
    { value: '30d', label: 'Last 30 days' },
  ];

  return (
    <div className="flex flex-col space-y-6 p-4 border rounded-lg bg-card">
      {/* Search and Home Button */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <FilterIcon className="h-5 w-5 text-primary" />
            Filter Jobs
          </h2>
          <Link to="/">
            <Button variant="ghost" size="sm" className="text-xs">
              <Home className="h-3 w-3 mr-1" />
              All Jobs
            </Button>
          </Link>
        </div>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search roles, skills, companies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      
      {/* Date Posted Filter */}
      <div>
        <Label htmlFor="date-filter" className="text-sm font-medium mb-2 flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-muted-foreground" />
          Date Posted
        </Label>
        <Select value={selectedDateFilter} onValueChange={onDateFilterChange}>
          <SelectTrigger id="date-filter" className="w-full">
            <SelectValue placeholder="Select date range" />
          </SelectTrigger>
          <SelectContent>
            {dateFilterOptions.map(option => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* General Filters (Remote, Full-time etc.) */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Quick Filters</Label>
        <div className="flex flex-wrap gap-2">
          <Button 
            variant={activeFilters.includes('remote') ? "default" : "outline"} 
            size="sm" 
            className="h-8 gap-1 text-xs"
            onClick={() => toggleFilter('remote')}
          >
            <Briefcase className="h-3 w-3" />
            Remote
          </Button>
          <Button 
            variant={activeFilters.includes('fulltime') ? "default" : "outline"} 
            size="sm" 
            className="h-8 gap-1 text-xs"
            onClick={() => toggleFilter('fulltime')}
          >
            <Clock className="h-3 w-3" />
            Full-time
          </Button>
          {/* Note: High-paying and Entry-level are currently not effective with the API search */}
          <Button 
            variant={activeFilters.includes('high-paying') ? "default" : "outline"} 
            size="sm" 
            className="h-8 gap-1 text-xs"
            onClick={() => toggleFilter('high-paying')}
            disabled // Optionally disable or indicate they are not working
            title="This filter is not currently active"
          >
            <DollarSign className="h-3 w-3" />
            High-paying
          </Button>
          <Button 
            variant={activeFilters.includes('entry-level') ? "default" : "outline"} 
            size="sm" 
            className="h-8 gap-1 text-xs"
            onClick={() => toggleFilter('entry-level')}
            disabled // Optionally disable or indicate they are not working
            title="This filter is not currently active"
          >
            <Book className="h-3 w-3" />
            Entry-level
          </Button>
        </div>
      </div>

      {/* Skills Filter */}
      <div>
        <Label className="text-sm font-medium mb-2 block">Filter by Skills</Label>
        {isLoading ? (
          <p className="text-xs text-muted-foreground">Loading skills...</p>
        ) : skills.length > 0 ? (
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {skills.map(skill => (
              <Badge
                key={skill}
                variant={activeSkillFilters.includes(skill) ? 'default' : 'outline'}
                onClick={() => toggleSkillFilter(skill)}
                className="cursor-pointer mr-1 mb-1 py-1 px-2 text-xs"
              >
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-xs text-muted-foreground">No skills available to filter by.</p>
        )}
      </div>
      
      {/* Active Filters Display & Clear All */}
      {(activeFilters.length > 0 || activeSkillFilters.length > 0 || selectedDateFilter !== 'any' || searchQuery !== '') && (
        <div className="pt-4 border-t">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-sm font-medium text-muted-foreground">Active Filters:</h3>
            <Button
              onClick={clearAllFilters}
              variant="link"
              size="sm"
              className="text-xs h-auto p-0"
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-1">
            {searchQuery && (
              <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                Search: "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-1 opacity-75 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {selectedDateFilter !== 'any' && (
               <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                Date: {dateFilterOptions.find(opt => opt.value === selectedDateFilter)?.label}
                <button onClick={() => onDateFilterChange('any')} className="ml-1 opacity-75 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )}
            {activeFilters.map(filter => (
              <Badge 
                key={filter} 
                variant="secondary"
                className="px-2 py-0.5 text-xs capitalize"
              >
                {filter}
                <button onClick={() => toggleFilter(filter)} className="ml-1 opacity-75 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
            {activeSkillFilters.map(skill => (
              <Badge 
                key={skill} 
                variant="secondary"
                className="px-2 py-0.5 text-xs"
              >
                Skill: {skill}
                <button onClick={() => toggleSkillFilter(skill)} className="ml-1 opacity-75 hover:opacity-100">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          {activeFilters.includes('high-paying') || activeFilters.includes('entry-level') ? (
            <p className="text-xs text-muted-foreground mt-2">
              Note: "High-paying" and "Entry-level" filters are not currently applied by the API.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default JobFilters;

