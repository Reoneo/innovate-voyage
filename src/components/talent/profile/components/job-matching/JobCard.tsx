
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building, MapPin, Clock, ExternalLink } from 'lucide-react';
import { Job } from '@/types/job';

interface JobCardProps {
  job: Job;
}

const formatSalary = (salary: string) => {
  return salary.replace('£', '£').replace(' per annum', '/year').replace(' per month', '/month').replace(' per day', '/day');
};

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  return (
    <Card 
      key={job.job_id} 
      className="hover:shadow-xl transition-all duration-300 border border-gray-200 bg-white rounded-lg overflow-hidden group hover:border-primary"
    >
      <CardHeader className="pb-3 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-300 p-4">
        <div className="flex flex-col sm:flex-row justify-between sm:items-start gap-2">
          <div className="flex-1">
            <CardTitle className="text-lg sm:text-xl text-gray-800 group-hover:text-primary transition-colors duration-300 mb-1 sm:mb-2">{job.title}</CardTitle>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs sm:text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Building className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                <span className="font-medium text-gray-700">{job.company}</span>
              </div>
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                <span>{job.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors duration-300" />
                <span>{job.type}</span>
              </div>
            </div>
          </div>
          {job.salary && job.salary.toLowerCase() !== 'n/a' && job.salary.toLowerCase() !== 'not specified' && (
            <Badge variant="secondary" className="text-green-700 bg-green-100 border border-green-200 font-semibold text-sm sm:text-base px-3 py-1 mt-2 sm:mt-0 self-start sm:self-center">
              {formatSalary(job.salary)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="p-4">
        <div 
          className="text-gray-700 leading-relaxed text-sm prose prose-sm max-w-none mb-4"
          dangerouslySetInnerHTML={{ __html: job.description.substring(0, 250) + (job.description.length > 250 ? '...' : '') }}
        />
        
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Key Skills:</h4>
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 5).map((skill) => ( // Show max 5 skills initially
                <Badge key={skill} variant="outline" className="bg-purple-50 text-purple-600 border-purple-200 text-xs font-medium">
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 5 && <Badge variant="outline" className="bg-gray-100 text-gray-500 border-gray-200 text-xs font-medium">+{job.skills.length-5} more</Badge>}
            </div>
          </div>
        )}
        
        <div className="flex flex-col sm:flex-row justify-between items-center pt-4 border-t border-gray-100">
          <span className="text-xs text-gray-500 mb-2 sm:mb-0">
            Posted: {new Date(job.posted_date).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'short', 
              year: 'numeric' 
            })}
          </span>
          <a 
            href={job.apply_url}
            target="_blank"
            rel="noopener noreferrer follow"
            className="inline-flex items-center gap-2 bg-primary hover:bg-primary/90 text-white font-semibold py-2 px-4 rounded-md text-sm transition-all duration-200 shadow-md hover:shadow-lg w-full sm:w-auto justify-center"
          >
            Apply Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </CardContent>
    </Card>
  );
};

export default JobCard;
