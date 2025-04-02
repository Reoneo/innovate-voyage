
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { AlertTriangle, Home, Search } from 'lucide-react';
import { Link } from 'react-router-dom';

interface ProfileNotFoundProps {
  ensNameOrAddress: string;
}

const ProfileNotFound: React.FC<ProfileNotFoundProps> = ({ ensNameOrAddress }) => {
  return (
    <div className="container mx-auto px-4 py-12">
      <Card className="max-w-lg mx-auto p-6 shadow-lg">
        <div className="flex flex-col items-center gap-6 text-center">
          <div className="bg-amber-100 p-4 rounded-full">
            <AlertTriangle className="h-12 w-12 text-amber-500" />
          </div>
          
          <div>
            <h1 className="text-2xl font-bold mb-2">Profile Not Found</h1>
            <p className="text-muted-foreground mb-4">
              We couldn't find a profile for <strong>{ensNameOrAddress}</strong>. 
              This blockchain profile might not exist or hasn't been indexed yet.
            </p>
            <div className="flex items-center justify-center bg-muted p-4 rounded-lg mb-6">
              <p className="text-sm">
                Try searching for a different ENS name, wallet address, or other web3 identity.
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
              asChild
            >
              <Link to="/">
                <Search className="h-4 w-4" />
                Search Again
              </Link>
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfileNotFound;
