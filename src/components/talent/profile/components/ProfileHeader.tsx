
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";

interface ProfileHeaderProps {
  children?: React.ReactNode;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ children }) => {
  return (
    <div className="flex items-center mb-4">
      <Link to="/">
        <Button variant="outline" size="sm" className="gap-1">
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Button>
      </Link>
      
      {children}
    </div>
  );
};

export default ProfileHeader;
