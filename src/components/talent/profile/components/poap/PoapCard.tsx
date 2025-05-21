
import React from 'react';

interface PoapCardProps {
  poap: {
    event: {
      name: string;
      image_url: string;
    };
  };
}

const PoapCard: React.FC<PoapCardProps> = ({ poap }) => {
  return (
    <div className="rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white h-full flex flex-col">
      <div className="h-32 relative overflow-hidden">
        <img 
          src={poap.event.image_url} 
          alt={poap.event.name} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col justify-between">
        <h3 className="text-sm font-medium leading-tight line-clamp-2 mb-1">
          {poap.event.name}
        </h3>
      </div>
    </div>
  );
};

export default PoapCard;
