
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { EducationSectionProps } from './types';
import { useEducationCredentials } from './hooks/useEducationCredentials';
import EducationCard from './EducationCard';
import EducationLoadingState from './EducationLoadingState';

const EducationSection: React.FC<EducationSectionProps> = ({ walletAddress }) => {
  const { credentials, isLoading, error } = useEducationCredentials(walletAddress);

  // Hide section completely if no wallet address
  if (!walletAddress) return null;

  // Hide section completely if no credentials and not loading
  if (!isLoading && !error && credentials.length === 0) {
    return null;
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GraduationCap className="h-5 w-5" />
          Education & Certifications
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && <EducationLoadingState />}
        
        {error && (
          <div className="text-center py-4 text-muted-foreground">
            <p>Unable to load education credentials</p>
          </div>
        )}
        
        {!isLoading && !error && credentials.length > 0 && (
          <div className="space-y-4">
            {credentials.map((credential) => (
              <EducationCard key={credential.id} credential={credential} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EducationSection;
