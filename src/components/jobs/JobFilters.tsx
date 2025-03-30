
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Briefcase, 
  DollarSign, 
  Clock, 
  Filter, 
  X, 
  Book, 
  Home 
} from 'lucide-react';
import { Link } from 'react-router-dom';

interface JobFiltersProps {
  setSearchQuery: (query: string) => void;
  searchQuery: string;
  activeFilters: string[];
  toggleFilter: (filter: string) => void;
}

const JobFilters: React.FC<JobFiltersProps> = ({ 
  setSearchQuery, 
  searchQuery, 
  activeFilters, 
  toggleFilter 
}) => {
  return (
    <div className="flex flex-col space-y-4">
      <div className="flex justify-between items-center">
        <div className="flex gap-2">
          <Link to="/">
            <Button variant="outline" size="sm" className="h-8 gap-1">
              <Home className="h-4 w-4" />
              Home
            </Button>
          </Link>
        </div>
        <h1 className="text-2xl font-bold">Job Opportunities</h1>
        <div className="w-24"></div>
      </div>

      <div className="relative">
        <Input
          type="text"
          placeholder="Search job roles, skills, or companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pr-8"
        />
        {searchQuery && (
          <button 
            onClick={() => setSearchQuery('')}
            className="absolute right-2 top-1/2 -translate-y-1/2"
          >
            <X className="h-4 w-4 opacity-50" />
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2">
        <Label className="hidden">Filters:</Label>
        <Button 
          variant={activeFilters.includes('remote') ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1"
          onClick={() => toggleFilter('remote')}
        >
          <Briefcase className="h-4 w-4" />
          Remote
        </Button>
        <Button 
          variant={activeFilters.includes('fulltime') ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1"
          onClick={() => toggleFilter('fulltime')}
        >
          <Clock className="h-4 w-4" />
          Full-time
        </Button>
        <Button 
          variant={activeFilters.includes('high-paying') ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1"
          onClick={() => toggleFilter('high-paying')}
        >
          <DollarSign className="h-4 w-4" />
          High-paying
        </Button>
        <Button 
          variant={activeFilters.includes('entry-level') ? "default" : "outline"} 
          size="sm" 
          className="h-8 gap-1"
          onClick={() => toggleFilter('entry-level')}
        >
          <Book className="h-4 w-4" />
          Entry-level
        </Button>
      </div>
      
      {activeFilters.length > 0 && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground">
            Active filters:
          </span>
          <div className="flex flex-wrap gap-1">
            {activeFilters.map(filter => (
              <Badge 
                key={filter} 
                variant="secondary"
                className="px-2 py-0"
              >
                {filter}
                <button onClick={() => toggleFilter(filter)} className="ml-1">
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
          <button 
            onClick={() => activeFilters.forEach(toggleFilter)}
            className="text-xs text-blue-500 hover:underline"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
};

export default JobFilters;
