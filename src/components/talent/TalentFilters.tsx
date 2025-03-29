
import React from 'react';
import { Filter } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface TalentFiltersProps {
  searchTerm: string;
  setSearchTerm: (value: string) => void;
  selectedSkills: string[];
  handleSkillToggle: (skill: string) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  clearFilters: () => void;
  allSkills: string[];
}

const TalentFilters: React.FC<TalentFiltersProps> = ({
  searchTerm,
  setSearchTerm,
  selectedSkills,
  handleSkillToggle,
  sortBy,
  setSortBy,
  clearFilters,
  allSkills,
}) => {
  return (
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
  );
};

export default TalentFilters;
