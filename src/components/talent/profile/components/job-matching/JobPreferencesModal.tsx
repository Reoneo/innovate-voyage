
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Briefcase, MapPin, Clock, Building } from 'lucide-react';

interface JobPreferencesModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPreferencesSubmit: (preferences: JobPreferences) => void;
}

export interface JobPreferences {
  country: string;
  jobType: string;
  sector: string;
}

const JobPreferencesModal: React.FC<JobPreferencesModalProps> = ({
  open,
  onOpenChange,
  onPreferencesSubmit
}) => {
  const [preferences, setPreferences] = useState<JobPreferences>({
    country: '',
    jobType: '',
    sector: ''
  });

  const countries = ['United States', 'United Kingdom', 'Canada', 'Germany', 'France', 'Netherlands', 'Australia', 'Remote'];
  const jobTypes = ['Full-time', 'Part-time', 'Contract', 'Freelance'];
  const sectors = ['Technology', 'Finance', 'Healthcare', 'Education', 'Marketing', 'Design', 'Engineering', 'Sales'];

  const handleSubmit = () => {
    if (preferences.country && preferences.jobType && preferences.sector) {
      onPreferencesSubmit(preferences);
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Job Preferences
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 mt-4">
          <Card className="p-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location/Country
                </label>
                <Select value={preferences.country} onValueChange={(value) => setPreferences({...preferences, country: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    {countries.map((country) => (
                      <SelectItem key={country} value={country}>{country}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Job Type
                </label>
                <Select value={preferences.jobType} onValueChange={(value) => setPreferences({...preferences, jobType: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Building className="h-4 w-4" />
                  Sector
                </label>
                <Select value={preferences.sector} onValueChange={(value) => setPreferences({...preferences, sector: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select sector" />
                  </SelectTrigger>
                  <SelectContent>
                    {sectors.map((sector) => (
                      <SelectItem key={sector} value={sector}>{sector}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </Card>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={!preferences.country || !preferences.jobType || !preferences.sector}
              className="flex-1"
            >
              Find Jobs
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default JobPreferencesModal;
