
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
    <div className="rounded-full overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer bg-white h-32 w-32 flex flex-col">
      <div className="h-24 relative overflow-hidden rounded-full">
        <img 
          src={poap.event.image_url} 
          alt={poap.event.name} 
          className="w-full h-full object-cover transform hover:scale-110 transition-transform duration-300 rounded-full"
        />
      </div>
      <div className="p-2 flex-1 flex flex-col justify-center items-center text-center">
        <h3 className="text-xs font-medium leading-tight line-clamp-2">
          {poap.event.name}
        </h3>
      </div>
    </div>
  );
};

export default PoapCard;
