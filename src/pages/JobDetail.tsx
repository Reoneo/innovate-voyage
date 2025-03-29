
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, Link } from 'react-router-dom';
import { jobsApi } from '@/api/jobsApi';
import { 
  ArrowLeft, 
  Briefcase, 
  Building, 
  Calendar, 
  MapPin, 
  Clock,
  ExternalLink
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';

const JobDetail = () => {
  const { jobId } = useParams<{ jobId: string }>();
  
  const { data: job, isLoading, error } = useQuery({
    queryKey: ['job', jobId],
    queryFn: () => jobsApi.getJobById(jobId!),
    enabled: !!jobId,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 px-4 sm:px-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center mb-6">
            <Skeleton className="h-10 w-24 mr-auto" />
          </div>
          <Skeleton className="h-12 w-2/3 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-64 w-full mb-8" />
          <Skeleton className="h-12 w-48 mx-auto" />
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <h2 className="text-2xl font-bold mb-4">Job not found</h2>
        <p className="text-muted-foreground mb-8">
          The job listing you're looking for doesn't exist or has been removed.
        </p>
        <Button asChild>
          <Link to="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Listings
          </Link>
        </Button>
      </div>
    );
  }

  // Format the posted date
  const formattedDate = (() => {
    try {
      return format(new Date(job.posted_date), 'MMMM d, yyyy');
    } catch (error) {
      return job.posted_date;
    }
  })();

  return (
    <div className="container mx-auto py-8 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <Button variant="ghost" asChild className="mb-6 -ml-2">
          <Link to="/jobs">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Job Listings
          </Link>
        </Button>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">{job.title}</h1>
            <Badge variant="outline" className="text-sm">{job.type}</Badge>
          </div>
          <div className="flex items-center mt-2">
            <Building className="h-4 w-4 mr-1 text-muted-foreground" />
            <span className="text-lg text-muted-foreground">{job.company}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="flex items-center p-4">
              <MapPin className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Location</p>
                <p className="font-medium">{job.location}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Briefcase className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Salary</p>
                <p className="font-medium">{job.salary}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center p-4">
              <Calendar className="h-5 w-5 mr-3 text-primary" />
              <div>
                <p className="text-sm text-muted-foreground">Posted</p>
                <p className="font-medium">{formattedDate}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <div className="prose max-w-none">
            <p className="text-card-foreground">{job.description}</p>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-center">
          <Button size="lg" asChild className="w-full sm:w-auto">
            <a href={job.apply_url} target="_blank" rel="noopener noreferrer">
              Apply Now
              <ExternalLink className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default JobDetail;
