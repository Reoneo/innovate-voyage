
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileNavigationBar: React.FC = () => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link to="/talent" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Talent
      </Link>
    </div>
  );
};

export default ProfileNavigationBar;
