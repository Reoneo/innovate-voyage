
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const FeaturedProfileSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSmithBoxClick = () => {
    navigate('/smith.box');
    toast.success('Loading smith.box profile');
  };

  return (
    <div className="max-w-xs mx-auto">
      <h3 className="text-xl font-semibold text-slate-300 mb-4 text-center">
        Featured Profile
      </h3>
      <Card 
        className="cursor-pointer transform hover:scale-102 transition-all duration-200 bg-slate-800/50 backdrop-blur-sm border border-slate-600/50 hover:border-slate-500 group shadow-lg hover:shadow-xl rounded-lg" 
        onClick={handleSmithBoxClick}
      >
        <CardContent className="p-6 text-center">
          <div className="mb-4">
            <Avatar className="h-16 w-16 mx-auto border-2 border-slate-600 group-hover:border-blue-400 transition-all duration-200">
              <AvatarImage 
                src="https://metadata.ens.domains/mainnet/avatar/smith.box" 
                alt="smith.box avatar" 
              />
              <AvatarFallback className="bg-slate-700 text-slate-300 text-lg font-medium">
                SB
              </AvatarFallback>
            </Avatar>
          </div>
          
          <h4 className="text-lg font-semibold text-white mb-2 group-hover:text-blue-300 transition-colors duration-200">
            smith.box
          </h4>
          <p className="text-slate-400 mb-4 text-sm">
            Web3 Domain Expert
          </p>
          
          <Button 
            variant="outline" 
            size="sm"
            className="border-slate-600 text-slate-300 hover:bg-slate-700 hover:border-blue-400 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-200 text-sm"
          >
            View Profile
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProfileSection;
