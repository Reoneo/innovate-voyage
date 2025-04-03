
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const ProfileNotFound: React.FC = () => {
  return (
    <div className="text-center py-20">
      <h2 className="text-2xl font-bold mb-4">Profile Not Found</h2>
      <p className="text-muted-foreground mb-6">Could not load profile information for this user</p>
      <Link to="/talent">
        <Button>Return to Talent Search</Button>
      </Link>
    </div>
  );
};

export default ProfileNotFound;
