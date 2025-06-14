
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { CalendarDays } from 'lucide-react';

interface DateFilterProps {
    dateFilter: string;
    onDateFilterChange: (value: string) => void;
}

const DateFilter: React.FC<DateFilterProps> = ({ dateFilter, onDateFilterChange }) => {
    return (
        <div className="mb-4 max-w-xs">
            <Label htmlFor="date-filter" className="text-sm font-medium mb-2 flex items-center gap-2">
              <CalendarDays className="h-4 w-4 text-muted-foreground" />
              Date Posted
            </Label>
            <Select value={dateFilter} onValueChange={onDateFilterChange}>
              <SelectTrigger id="date-filter" className="w-full">
                <SelectValue placeholder="Select date range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any time</SelectItem>
                <SelectItem value="24h">Last 24 hours</SelectItem>
                <SelectItem value="3d">Last 3 days</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="14d">Last 14 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
        </div>
    );
}

export default DateFilter;
