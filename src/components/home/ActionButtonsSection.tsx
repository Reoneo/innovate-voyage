import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
const ActionButtonsSection: React.FC = () => {
  const navigate = useNavigate();
  return <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
      <Button size="lg" variant="default" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl" onClick={() => toast.info("Browse Talent feature coming soon!")}>
        <Users className="mr-2 h-5 w-5" />
        Browse Talent
      </Button>
      
      
      
      <Button size="lg" variant="secondary" className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl" onClick={() => toast.info("List Jobs feature coming soon!")}>
        <Plus className="mr-2 h-5 w-5" />
        List Jobs
      </Button>
    </div>;
};
export default ActionButtonsSection;