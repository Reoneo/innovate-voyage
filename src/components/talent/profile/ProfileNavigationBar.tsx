
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ProfileNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div className="flex justify-between items-center mb-6">
      <a 
        href="/" 
        onClick={handleBackClick}
        className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Home
      </a>
    </div>
  );
};

export default ProfileNavigationBar;
