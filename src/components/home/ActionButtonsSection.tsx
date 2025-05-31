
import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ActionButtonsSection: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-4">
      <Button 
        variant="outline" 
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm flex items-center gap-2 px-6 py-3"
        onClick={() => toast.info("Feature coming soon!")}
      >
        <Users className="h-4 w-4" />
        For Recruiters
      </Button>
      <Button 
        variant="outline" 
        className="bg-white/10 border-white/20 text-white hover:bg-white/20 backdrop-blur-sm flex items-center gap-2 px-6 py-3"
        onClick={() => toast.info("Feature coming soon!")}
      >
        <Briefcase className="h-4 w-4" />
        For Talent
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
