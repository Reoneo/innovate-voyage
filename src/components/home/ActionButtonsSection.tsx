
import React from 'react';
import { Users, Briefcase } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ActionButtonsSection: React.FC = () => {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
      <Button 
        size="lg" 
        variant="default" 
        className="h-12 px-8 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-200" 
        onClick={() => toast.info("Browse Talent feature coming soon!")}
      >
        <Users className="mr-2 h-5 w-5" />
        Browse Talent
      </Button>
      
      <Button 
        size="lg" 
        variant="outline" 
        className="h-12 px-8 border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white font-medium rounded-lg transition-all duration-200" 
        onClick={() => toast.info("List Jobs feature coming soon!")}
      >
        <Briefcase className="mr-2 h-5 w-5" />
        List Jobs
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
