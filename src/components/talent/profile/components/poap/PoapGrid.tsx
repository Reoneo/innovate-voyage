
import React from 'react';
import { Poap } from '@/api/services/poapService';

interface PoapGridProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
}

const PoapGrid: React.FC<PoapGridProps> = ({ poaps, onPoapClick }) => {
  if (poaps.length === 0) return null;

  return (
    <div className="flex flex-wrap justify-center gap-3 py-4">
      {poaps.map((poap) => (
        <div
          key={poap.tokenId}
          className="relative cursor-pointer group"
          onClick={() => onPoapClick(poap)}
        >
          <img
            src={poap.event.image_url}
            alt={poap.event.name}
            className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 group-hover:scale-105 group-hover:shadow-lg transition-all duration-200"
            loading="lazy"
          />
          <div className="absolute inset-0 rounded-full border-2 border-transparent group-hover:border-blue-400/50 transition-all duration-200"></div>
        </div>
      ))}
    </div>
  );
};

export default PoapGrid;
