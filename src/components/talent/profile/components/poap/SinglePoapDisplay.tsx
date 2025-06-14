
import React from 'react';
import { Poap } from '@/api/services/poapService';

interface SinglePoapDisplayProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
}

const SinglePoapDisplay: React.FC<SinglePoapDisplayProps> = ({ poaps, onPoapClick }) => {
  if (!poaps || poaps.length === 0) {
    return null; // Or some placeholder if needed
  }

  return (
    <div className="flex items-center justify-center w-full">
      {poaps.map((poap) => (
        <div 
          key={poap.tokenId}
          className="relative cursor-pointer group" 
          onClick={() => onPoapClick(poap)}
        >
          <img 
            src={poap.event.image_url} 
            alt={poap.event.name} 
            className="w-40 h-40 rounded-full cursor-pointer z-10 p-2 object-contain" 
            style={{
              background: 'rgba(0,0,0,0.7)'
            }} 
          />
          <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
        </div>
      ))}
    </div>
  );
};

export default SinglePoapDisplay;

