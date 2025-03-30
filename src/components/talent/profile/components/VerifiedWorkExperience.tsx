
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Briefcase, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { useWeb3WorkExperience } from '@/hooks/useWeb3WorkExperience';
import { format } from 'date-fns';

interface VerifiedWorkExperienceProps {
  walletAddress?: string;
}

const VerifiedWorkExperience: React.FC<VerifiedWorkExperienceProps> = ({ walletAddress }) => {
  const { experience, isLoading, error } = useWeb3WorkExperience(walletAddress);

  if (!walletAddress) {
    return null;
  }

  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return 'Present';
    try {
      return format(new Date(dateStr), 'MMM yyyy');
    } catch (err) {
      return dateStr;
    }
  };

  return (
    <Card id="verified-work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Verified Web3 Experience</CardTitle>
            <CardDescription>On-chain verified work history</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : error ? (
          <div className="text-center py-6 text-muted-foreground">
            Unable to load verified work history
          </div>
        ) : experience.length > 0 ? (
          <div className="space-y-6">
            {experience.map((job, index) => (
              <div key={index} className="border-b last:border-b-0 pb-4 last:pb-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{job.role}</h3>
                      {job.verified ? (
                        <Badge variant="outline" className="flex items-center gap-1 text-green-600 border-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Verified
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="flex items-center gap-1 text-amber-600 border-amber-600">
                          <XCircle className="h-3 w-3" />
                          Pending
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Briefcase className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{formatDate(job.start_date)} - {formatDate(job.end_date)}</span>
                    </div>
                  </div>
                </div>
                
                {job.description && (
                  <p className="text-sm whitespace-pre-wrap mt-2">{job.description}</p>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-muted-foreground">
              No verified Web3 work experience found. Connect your wallet to sync your on-chain work history.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VerifiedWorkExperience;
