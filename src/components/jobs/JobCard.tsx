
import React from 'react';
import { Job } from '@/types/job';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Briefcase } from 'lucide-react';
import { format } from 'date-fns';

interface JobCardProps {
  job: Job;
}

const JobCard: React.FC<JobCardProps> = ({ job }) => {
  // Format the posted date
  const formattedDate = (() => {
    try {
      return format(new Date(job.posted_date), 'MMM d, yyyy');
    } catch (error) {
      return job.posted_date;
    }
  })();

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md glass-card">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl">{job.title}</CardTitle>
            <CardDescription className="flex items-center gap-1 mt-1">
              <span className="font-medium">{job.company}</span>
            </CardDescription>
          </div>
          <Badge variant={
            job.type === 'Full-Time' ? 'default' :
            job.type === 'Part-Time' ? 'secondary' :
            job.type === 'Contract' ? 'outline' :
            job.type === 'Temporary' ? 'destructive' : 'default'
          }>
            {job.type}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
        <div className="flex flex-wrap gap-1.5 mb-4">
          {job.skills.slice(0, 5).map((skill) => (
            <Badge key={skill} variant="secondary" className="rounded-full text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 5 && (
            <Badge variant="secondary" className="rounded-full text-xs">
              +{job.skills.length - 5} more
            </Badge>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="h-3.5 w-3.5" />
            <span>{job.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            <span>{job.salary}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            <span>Posted: {formattedDate}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-2 flex justify-between">
        <Button variant="outline" size="sm" asChild>
          <a href={`/jobs/${job.job_id}`}>View Details</a>
        </Button>
        <Button size="sm" asChild>
          <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
            Apply Now
          </a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JobCard;
