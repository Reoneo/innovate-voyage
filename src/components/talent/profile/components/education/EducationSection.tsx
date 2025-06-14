
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap } from 'lucide-react';
import { EducationSectionProps } from './types';
import { useEducationCredentials } from './hooks/useEducationCredentials';
import EducationCard from './EducationCard';
import EducationLoadingState from './EducationLoadingState';

const EducationSection: React.FC<EducationSectionProps> = ({ walletAddress }) => {
  const { credentials, isLoading, error } = useEducationCredentials(walletAddress);

  if (!walletAddress) return null;

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
        
        {!isLoading && !error && credentials.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <GraduationCap className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No verified education credentials found</p>
            <p className="text-sm mt-1">
              Connect your educational credentials via Web3 identity providers
            </p>
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
