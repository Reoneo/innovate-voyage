
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, Calendar, Briefcase, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';
import { LinkedInJob } from '@/api/services/linkedinService';

interface LinkedInExperienceSectionProps {
  experience: LinkedInJob[];
  isLoading: boolean;
  error: string | null;
}

const LinkedInExperienceSection: React.FC<LinkedInExperienceSectionProps> = ({ 
  experience, 
  isLoading,
  error
}) => {
  // Show loading state
  if (isLoading) {
    return (
      <Card id="linkedin-experience-section">
        <CardHeader>
          <CardTitle>LinkedIn Experience</CardTitle>
          <CardDescription>Professional work history</CardDescription>
        </CardHeader>
        <CardContent>
          {[1, 2, 3].map((i) => (
            <div key={i} className="mb-6 last:mb-0">
              <div className="flex justify-between mb-2">
                <Skeleton className="h-5 w-36" />
                <Skeleton className="h-4 w-24" />
              </div>
              <Skeleton className="h-4 w-48 mb-2" />
              <Skeleton className="h-16 w-full" />
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }
  
  // Show error state
  if (error) {
    return (
      <Card id="linkedin-experience-section" className="border-red-200">
        <CardHeader>
          <CardTitle>LinkedIn Experience</CardTitle>
          <CardDescription className="text-red-500">Error loading experience: {error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }
  
  // Don't show the section if there's no experience data
  if (!experience || experience.length === 0) {
    return null;
  }

  const formatDisplayDate = (dateString: string | null): string => {
    if (!dateString) return 'Present';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card id="linkedin-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/c/ca/LinkedIn_logo_initials.png" 
                alt="LinkedIn" 
                className="w-5 h-5 mr-2"
              />
              LinkedIn Experience
            </CardTitle>
            <CardDescription>Recent professional experience</CardDescription>
          </div>
          <Badge variant="outline" className="text-blue-600 border-blue-300">Verified</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {experience.map((job) => (
            <div key={job.id} className="border-b last:border-b-0 pb-4 last:pb-0">
              <div className="mb-1">
                <h3 className="font-medium text-lg flex items-center">
                  <Briefcase className="h-4 w-4 mr-2 text-muted-foreground" />
                  {job.role}
                </h3>
                <p className="text-muted-foreground flex items-center">
                  <Building className="h-4 w-4 mr-2" />
                  {job.company}
                </p>
              </div>
              
              <div className="flex items-center text-sm text-muted-foreground mb-2">
                <Calendar className="h-3 w-3 mr-1" />
                <span>{formatDisplayDate(job.startDate)} - {formatDisplayDate(job.endDate)}</span>
                
                {job.location && (
                  <>
                    <span className="mx-2">•</span>
                    <MapPin className="h-3 w-3 mr-1" />
                    <span>{job.location}</span>
                  </>
                )}
              </div>
              
              {job.description && (
                <p className="text-sm">{job.description}</p>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LinkedInExperienceSection;
