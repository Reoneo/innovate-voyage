
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Clock, Home } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileTimeoutErrorProps {
  identity?: string;
}

const ProfileTimeoutError: React.FC<ProfileTimeoutErrorProps> = ({ identity }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto p-6 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-red-100 p-4 rounded-full">
            <Clock className="h-12 w-12 text-red-500" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">Profile Loading Timeout</h1>
            <p className="text-muted-foreground mb-4">
              We're having trouble loading the profile for <strong>{identity || "this address"}</strong>. 
              The request has timed out after waiting for more than 4 seconds.
            </p>
            <div className="flex items-center justify-center bg-amber-50 p-4 rounded-lg mb-6">
              <AlertTriangle className="h-5 w-5 text-amber-600 mr-2" />
              <p className="text-amber-700 text-sm">
                This could be due to network congestion, rate limiting, or the profile might not exist.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Button
              variant="default"
              className="flex items-center gap-2 flex-1"
              asChild
            >
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            
            <Button
              variant="outline"
              className="flex items-center gap-2 flex-1"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileTimeoutError;
