
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { toast } from 'sonner';

const FeaturedProfileSection: React.FC = () => {
  const navigate = useNavigate();

  const handleSmithBoxClick = () => {
    navigate('/smith.box');
    toast.success('Loading smith.box profile');
  };

  return (
    <div className="max-w-sm mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">Featured Profile</h2>
      <Card 
        className="cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 group" 
        onClick={handleSmithBoxClick}
      >
        <CardContent className="p-8 text-center">
          <div className="relative mb-6">
            <Avatar className="h-24 w-24 mx-auto border-4 border-white/20 shadow-2xl">
              <AvatarImage 
                src="https://metadata.ens.domains/mainnet/avatar/smith.box" 
                alt="smith.box avatar" 
              />
              <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">
                SB
              </AvatarFallback>
            </Avatar>
            <div className="absolute -top-2 -right-2">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                <Star className="w-3 h-3 mr-1" />
                Featured
              </Badge>
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-white mb-2">smith.box</h3>
          <p className="text-gray-300 mb-4">Web3 Domain Expert</p>
          
          <Button 
            variant="outline" 
            className="border-white/30 text-white hover:bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
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
