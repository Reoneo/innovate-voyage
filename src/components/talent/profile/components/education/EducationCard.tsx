
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Award, CheckCircle, AlertCircle } from 'lucide-react';
import { EducationalCredential } from './types';
import { format } from 'date-fns';

interface EducationCardProps {
  credential: EducationalCredential;
}

const EducationCard: React.FC<EducationCardProps> = ({ credential }) => {
  const isExpired = credential.expirationDate && new Date(credential.expirationDate) < new Date();
  
  return (
    <Card className="relative">
      <CardContent className="pt-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-sm">
              {credential.credentialSubject.degree || 'Certificate'}
            </h4>
            <p className="text-sm text-muted-foreground">
              {credential.credentialSubject.institution}
            </p>
            {credential.credentialSubject.fieldOfStudy && (
              <p className="text-xs text-muted-foreground mt-1">
                {credential.credentialSubject.fieldOfStudy}
              </p>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            {credential.verified && !isExpired ? (
              <Badge variant="default" className="text-xs">
                <CheckCircle className="h-3 w-3 mr-1" />
                Verified
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-xs">
                <AlertCircle className="h-3 w-3 mr-1" />
                {isExpired ? 'Expired' : 'Unverified'}
              </Badge>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>
              {format(new Date(credential.credentialSubject.completionDate), 'MMM yyyy')}
            </span>
          </div>
          
          {credential.credentialSubject.grade && (
            <div className="flex items-center gap-1">
              <Award className="h-3 w-3" />
              <span>{credential.credentialSubject.grade}</span>
            </div>
          )}
        </div>
        
        {credential.credentialSubject.skills && credential.credentialSubject.skills.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {credential.credentialSubject.skills.slice(0, 3).map((skill, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {skill}
              </Badge>
            ))}
            {credential.credentialSubject.skills.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{credential.credentialSubject.skills.length - 3} more
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationCard;
