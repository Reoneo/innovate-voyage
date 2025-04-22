
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface PoapCardProps {
  imageUrl: string;
  name: string;
  date: string;
  location?: string;
}

const PoapCard: React.FC<PoapCardProps> = ({ imageUrl, name, date, location }) => {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative group cursor-pointer transform transition-all duration-300 hover:scale-105">
            <div className="absolute -inset-0.5 rounded-xl bg-gradient-to-r from-purple-600 to-blue-500 opacity-50 blur-sm group-hover:opacity-75 group-hover:blur transition duration-300"></div>
            <div className="relative bg-gray-900/40 backdrop-blur-sm rounded-xl overflow-hidden border border-gray-700/50">
              <img 
                src={imageUrl} 
                alt={name} 
                className="w-full h-auto aspect-square object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-2 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="truncate font-semibold">{name}</div>
                <div className="text-xs opacity-70">{date}</div>
              </div>
            </div>
          </div>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-[200px]">
          <div className="text-sm font-medium">{name}</div>
          <div className="text-xs opacity-70">{date}</div>
          {location && <div className="text-xs opacity-70">{location}</div>}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default PoapCard;
