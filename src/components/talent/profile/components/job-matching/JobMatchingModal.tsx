
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { jobsApi } from '@/api/jobsApi';
import { useQuery } from '@tanstack/react-query';
import { JobPreferences } from './JobPreferencesModal';
import JobMatchingHeader from './JobMatchingHeader';
import DateFilter from './DateFilter';
import JobList from './JobList';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';
import { Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationNext, PaginationLink, PaginationEllipsis } from '@/components/ui/pagination';
import { cn } from '@/lib/utils';

interface JobMatchingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  jobPreferences: JobPreferences | null;
  onBackToPreferences: () => void;
}

const JobMatchingModal: React.FC<JobMatchingModalProps> = ({
  open,
  onOpenChange,
  jobPreferences,
  onBackToPreferences
}) => {
  const [dateFilter, setDateFilter] = React.useState('any');
  const [searchTerm, setSearchTerm] = React.useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [currentPage, setCurrentPage] = React.useState(1);
  const jobsPerPage = 20;

  const { data: jobs = [], isLoading, error: queryError } = useQuery({
    queryKey: ['all-jobs', dateFilter, jobPreferences, debouncedSearchTerm],
    queryFn: async () => {
      console.log('Fetching jobs with date filter:', dateFilter, ' and preferences: ', jobPreferences, ' and search: ', debouncedSearchTerm);
      
      const daysMap: Record<string, number> = {
        '24h': 1,
        '3d': 3,
        '7d': 7,
        '14d': 14,
        '30d': 30,
      };
      const days = dateFilter !== 'any' ? daysMap[dateFilter] : undefined;
      
      const searchKeywords = [jobPreferences?.sector, debouncedSearchTerm].filter(Boolean).join(' ').trim();

      const jobs = await jobsApi.searchJobs({ 
        postedWithinDays: days,
        location: jobPreferences?.country,
        type: jobPreferences?.jobType,
        search: searchKeywords || undefined,
      });
      console.log('Total jobs fetched:', jobs.length);
      
      return jobs;
    },
    enabled: open && !!jobPreferences
  });

  React.useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, dateFilter, jobPreferences]);

  const totalPages = Math.ceil(jobs.length / jobsPerPage);
  const paginatedJobs = jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
        setCurrentPage(page);
    }
  };

  const renderPaginationItems = () => {
    if (totalPages <= 1) return null;

    const rangeWithDots: (string | number)[] = [];
    const delta = 1;
    const left = currentPage - delta;
    const right = currentPage + delta + 1;
    const range: number[] = [];

    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= left && i < right)) {
            range.push(i);
        }
    }

    let l: number | undefined;
    for (const i of range) {
        if (l) {
            if (i - l === 2) {
                rangeWithDots.push(l + 1);
            } else if (i - l !== 1) {
                rangeWithDots.push('...');
            }
        }
        rangeWithDots.push(i);
        l = i;
    }

    return rangeWithDots.map((page, index) => {
        if (page === '...') {
            return (
                <PaginationItem key={`ellipsis-${index}`}>
                    <PaginationEllipsis />
                </PaginationItem>
            );
        }
        return (
            <PaginationItem key={page}>
                <PaginationLink
                    href="#"
                    onClick={(e) => { e.preventDefault(); handlePageChange(page as number); }}
                    isActive={currentPage === page}
                >
                    {page}
                </PaginationLink>
            </PaginationItem>
        );
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-screen h-screen max-w-none max-h-none m-0 p-0 bg-gray-50 border-0 shadow-2xl rounded-none overflow-hidden flex flex-col">
        <JobMatchingHeader 
          onBackToPreferences={onBackToPreferences}
          jobPreferences={jobPreferences}
        />
        
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <DateFilter dateFilter={dateFilter} onDateFilterChange={setDateFilter} />
            <div className="flex-1 max-w-full sm:max-w-xs">
                <Label htmlFor="search-jobs" className="text-sm font-medium mb-2 flex items-center gap-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    Search
                </Label>
                <Input
                    id="search-jobs"
                    placeholder="Keyword, skill, company..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
          </div>

          <JobList 
            isLoading={isLoading}
            queryError={queryError as Error | null}
            jobs={paginatedJobs}
            totalJobs={jobs.length}
            onBackToPreferences={onBackToPreferences}
            jobPreferences={jobPreferences}
          />

          {totalPages > 1 && (
            <div className="mt-6 flex justify-center">
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage - 1); }}
                                className={cn(currentPage === 1 && "pointer-events-none opacity-50")}
                            />
                        </PaginationItem>
                        {renderPaginationItems()}
                        <PaginationItem>
                            <PaginationNext
                                href="#"
                                onClick={(e) => { e.preventDefault(); handlePageChange(currentPage + 1); }}
                                className={cn(currentPage === totalPages && "pointer-events-none opacity-50")}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobMatchingModal;
