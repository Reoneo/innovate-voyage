
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
      <h2 className="text-3xl font-bold text-white mb-8 text-center">
        <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
          Featured Profile
        </span>
      </h2>
      <Card 
        className="cursor-pointer transform hover:scale-105 transition-all duration-500 bg-gradient-to-br from-black/40 to-purple-900/20 backdrop-blur-sm border-2 border-cyan-500/30 hover:border-cyan-400/50 group shadow-2xl shadow-cyan-500/20 hover:shadow-cyan-500/40 rounded-2xl" 
        onClick={handleSmithBoxClick}
      >
        <CardContent className="p-8 text-center relative overflow-hidden">
          {/* Background glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"></div>
          
          <div className="relative mb-8">
            <div className="relative">
              <Avatar className="h-28 w-28 mx-auto border-4 border-cyan-400/50 shadow-2xl shadow-cyan-500/50 group-hover:border-cyan-300 transition-all duration-300">
                <AvatarImage 
                  src="https://metadata.ens.domains/mainnet/avatar/smith.box" 
                  alt="smith.box avatar" 
                />
                <AvatarFallback className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white text-2xl font-bold">
                  SB
                </AvatarFallback>
              </Avatar>
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-cyan-400/20 to-purple-400/20 blur-xl animate-pulse group-hover:blur-2xl transition-all duration-300"></div>
            </div>
            <div className="absolute -top-3 -right-3">
              <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold shadow-lg animate-pulse">
                <Star className="w-4 h-4 mr-1" />
                Featured
              </Badge>
            </div>
          </div>
          
          <h3 className="text-3xl font-bold text-white mb-3 group-hover:text-cyan-300 transition-colors duration-300">
            smith.box
          </h3>
          <p className="text-gray-300 mb-6 text-lg group-hover:text-purple-300 transition-colors duration-300">
            Web3 Domain Expert
          </p>
          
          <Button 
            variant="outline" 
            className="border-2 border-cyan-400/50 text-cyan-300 hover:bg-cyan-400/20 hover:border-cyan-300 opacity-0 group-hover:opacity-100 transition-all duration-500 font-semibold rounded-xl shadow-lg hover:shadow-cyan-400/30"
          >
            View Profile
            <ArrowRight className="ml-2 h-5 w-5 group-hover:animate-pulse" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturedProfileSection;
