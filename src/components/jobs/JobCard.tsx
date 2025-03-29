
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
import { Calendar, MapPin, Briefcase, Shield, Check, Award } from 'lucide-react';
import { format } from 'date-fns';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import * as d3 from 'd3';
import { useEffect, useRef } from 'react';

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
  const badgeRef = useRef<HTMLDivElement>(null);
  
  // Generate mini-visualization for the CVB badge
  useEffect(() => {
    if (!badgeRef.current) return;
    
    // Only create visualization if it doesn't already exist
    if (badgeRef.current.querySelector('svg')) return;
    
    const size = 18;
    const svg = d3.select(badgeRef.current)
      .append('svg')
      .attr('width', size)
      .attr('height', size)
      .attr('viewBox', `0 0 ${size} ${size}`)
      .style('position', 'absolute')
      .style('top', '0')
      .style('left', '0')
      .style('border-radius', '50%');
    
    // Create background circle
    svg.append('circle')
      .attr('cx', size/2)
      .attr('cy', size/2)
      .attr('r', size/2)
      .attr('fill', getVerificationClassColor());
    
    // Create circular progress indicator
    const arc = d3.arc()
      .innerRadius(size/2 - 3)
      .outerRadius(size/2)
      .startAngle(0)
      .endAngle(verificationLevel / 100 * 2 * Math.PI);
    
    svg.append('path')
      .attr('d', arc as any)
      .attr('fill', 'white')
      .attr('opacity', 0.7)
      .attr('transform', `translate(${size/2}, ${size/2})`);
    
    // Create central dot
    svg.append('circle')
      .attr('cx', size/2)
      .attr('cy', size/2)
      .attr('r', size/4)
      .attr('fill', 'white')
      .attr('opacity', 0.9);
  }, [verificationLevel]);

  const getVerificationClass = () => {
    if (verificationLevel >= 90) return "bg-purple-500";
    if (verificationLevel >= 75) return "bg-indigo-500";
    if (verificationLevel >= 60) return "bg-blue-500";
    if (verificationLevel >= 45) return "bg-emerald-500";
    if (verificationLevel >= 30) return "bg-amber-500";
    return "bg-gray-400";
  };
  
  const getVerificationClassColor = () => {
    if (verificationLevel >= 90) return "#8b5cf6"; // purple
    if (verificationLevel >= 75) return "#6366f1"; // indigo
    if (verificationLevel >= 60) return "#3b82f6"; // blue
    if (verificationLevel >= 45) return "#10b981"; // emerald
    if (verificationLevel >= 30) return "#f59e0b"; // amber
    return "#9ca3af"; // gray
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md glass-card relative">
      {/* CVB Badge */}
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div 
              ref={badgeRef}
              className={`absolute top-3 right-3 z-10 flex items-center justify-center gap-1 p-1 rounded-full ${getVerificationClass()} w-6 h-6`}
            >
              {/* D3 visualization is appended here by the useEffect */}
              <Shield className="h-3 w-3 text-white absolute" style={{ opacity: 0.7 }} />
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
                  <Award className="h-3 w-3 text-green-500" />
                  <span>CVB Score: {verificationLevel}</span>
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
