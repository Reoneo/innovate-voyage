
import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Search, SlidersHorizontal } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';

const TaskFilter: React.FC = () => {
  const { setFilter, currentFilter } = useTaskContext();
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter({ ...currentFilter, searchTerm: e.target.value });
  };
  
  const handleStatusChange = (value: string) => {
    setFilter({ ...currentFilter, status: value as any });
  };
  
  const handlePriorityChange = (value: string) => {
    setFilter({ ...currentFilter, priority: value as any });
  };
  
  const clearFilters = () => {
    setFilter({ status: 'all', priority: 'all', searchTerm: '' });
  };
  
  // For mobile filters
  const FiltersContent = () => (
    <>
      <div className="mb-4">
        <Label htmlFor="status-filter">Status</Label>
        <Select
          value={currentFilter.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger id="status-filter">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="mb-4">
        <Label htmlFor="priority-filter">Priority</Label>
        <Select
          value={currentFilter.priority || 'all'}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger id="priority-filter">
            <SelectValue placeholder="Filter by priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </>
  );

  return (
    <div className="flex flex-wrap items-center gap-3 mb-6">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Search tasks..."
          value={currentFilter.searchTerm || ''}
          onChange={handleSearchChange}
          className="pl-9"
        />
      </div>
      
      {/* Desktop filters */}
      <div className="hidden md:flex items-center gap-3">
        <Select
          value={currentFilter.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="todo">To Do</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        
        <Select
          value={currentFilter.priority || 'all'}
          onValueChange={handlePriorityChange}
        >
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Priorities</SelectItem>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
        
        {(currentFilter.status !== 'all' || currentFilter.priority !== 'all' || currentFilter.searchTerm) && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Clear filters
          </Button>
        )}
      </div>
      
      {/* Mobile filters */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <SlidersHorizontal className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <SheetHeader>
              <SheetTitle>Filter Tasks</SheetTitle>
            </SheetHeader>
            <div className="py-4">
              <FiltersContent />
              <Button onClick={clearFilters} variant="outline" className="w-full">
                Clear Filters
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </div>
  );
};

export default TaskFilter;
