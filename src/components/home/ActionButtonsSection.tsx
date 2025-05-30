
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Briefcase, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const ActionButtonsSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
      <Button 
        size="lg" 
        variant="default" 
        className="h-14 px-10 bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 hover:from-blue-500 hover:via-purple-500 hover:to-cyan-500 text-white shadow-2xl shadow-blue-500/30 border border-blue-500/30 rounded-xl font-semibold transition-all duration-300 hover:shadow-blue-500/50 hover:scale-105 group" 
        onClick={() => toast.info("Browse Talent feature coming soon!")}
      >
        <Users className="mr-3 h-6 w-6 group-hover:animate-pulse" />
        Browse Talent
      </Button>
      
      <Button 
        size="lg" 
        variant="secondary" 
        className="h-14 px-10 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-700 hover:from-purple-500 hover:via-pink-500 hover:to-purple-600 text-white shadow-2xl shadow-purple-500/30 border border-purple-500/30 rounded-xl font-semibold transition-all duration-300 hover:shadow-purple-500/50 hover:scale-105 group" 
        onClick={() => toast.info("List Jobs feature coming soon!")}
      >
        <Plus className="mr-3 h-6 w-6 group-hover:animate-pulse" />
        List Jobs
      </Button>
    </div>
  );
};

export default ActionButtonsSection;
