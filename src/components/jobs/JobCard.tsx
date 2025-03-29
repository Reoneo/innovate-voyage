
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
import { Calendar, MapPin, Briefcase, Shield, Check } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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

  // Random CVB verification level for demonstration
  const verificationLevel = Math.floor(Math.random() * 100);
  const getVerificationClass = () => {
    if (verificationLevel >= 90) return "bg-purple-500";
    if (verificationLevel >= 75) return "bg-indigo-500";
    if (verificationLevel >= 60) return "bg-blue-500";
    if (verificationLevel >= 45) return "bg-emerald-500";
    if (verificationLevel >= 30) return "bg-amber-500";
    return "bg-gray-400";
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md glass-card relative">
      {/* CVB Badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="absolute top-3 right-3 z-10 flex items-center gap-1 p-1 rounded-full bg-secondary/80 backdrop-blur-sm">
              <Shield className={`h-4 w-4 ${verificationLevel >= 75 ? "text-indigo-500" : verificationLevel >= 50 ? "text-blue-500" : "text-gray-500"}`} />
              <span className="flex items-center">
                <span className={`text-xs font-semibold ${verificationLevel >= 75 ? "text-indigo-500" : verificationLevel >= 50 ? "text-blue-500" : "text-gray-500"}`}>CVB</span>
              </span>
            </div>
          </TooltipTrigger>
          <TooltipContent className="w-56">
            <div className="space-y-2">
              <h4 className="font-medium">Cryptographic Verification Badge</h4>
              <div className="bg-secondary/50 rounded-full h-2 mb-1">
                <div 
                  className={`h-2 rounded-full ${getVerificationClass()}`} 
                  style={{ width: `${verificationLevel}%` }}
                ></div>
              </div>
              <div className="flex text-xs text-muted-foreground gap-3">
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>On-chain data</span>
                </div>
                <div className="flex items-center gap-1">
                  <Check className="h-3 w-3 text-green-500" />
                  <span>Verified issuer</span>
                </div>
              </div>
            </div>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

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
