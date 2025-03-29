
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProfileNavigationBarProps {
  onExportPdf: () => void;
}

const ProfileNavigationBar: React.FC<ProfileNavigationBarProps> = ({ onExportPdf }) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <Link to="/talent" className="flex items-center text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Talent
      </Link>
      <Button onClick={onExportPdf} variant="outline">
        <Download className="h-4 w-4 mr-2" />
        Export as PDF
      </Button>
    </div>
  );
};

export default ProfileNavigationBar;
