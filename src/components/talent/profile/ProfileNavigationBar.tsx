
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';

const ProfileNavigationBar: React.FC = () => {
  const navigate = useNavigate();
  
  const handleBackClick = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate('/talent');
  };

  return (
    <Button 
      variant="outline" 
      onClick={handleBackClick}
      className="flex items-center gap-2 text-sm"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to Talent
    </Button>
  );
};

export default ProfileNavigationBar;
