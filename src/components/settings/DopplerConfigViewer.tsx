
import React, { useState } from 'react';
import { useDoppler } from '@/hooks/useDoppler';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ShieldAlert, CheckCircle } from 'lucide-react';

const DopplerConfigViewer: React.FC = () => {
  const { fetchSecrets, isLoading, error, hasApiKey } = useDoppler();
  const [secretsLoaded, setSecretsLoaded] = useState(false);
  
  const handleFetchSecrets = async () => {
    const result = await fetchSecrets();
    setSecretsLoaded(!!result);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doppler Configuration</CardTitle>
        <CardDescription>Access and manage your application secrets</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="font-medium">API Connection Status:</div>
            {hasApiKey ? (
              <div className="flex items-center text-green-500">
                <CheckCircle className="h-4 w-4 mr-1" />
                <span>API Key Configured</span>
              </div>
            ) : (
              <div className="flex items-center text-red-500">
                <ShieldAlert className="h-4 w-4 mr-1" />
                <span>API Key Missing</span>
              </div>
            )}
          </div>
          
          {error && (
            <div className="text-red-500 text-sm">
              Error: {error.message}
            </div>
          )}
          
          {secretsLoaded && (
            <div className="text-green-500 text-sm">
              Successfully connected to Doppler API
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleFetchSecrets} 
          disabled={isLoading || !hasApiKey}
        >
          {isLoading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
          Test Connection
        </Button>
      </CardFooter>
    </Card>
  );
};

export default DopplerConfigViewer;
