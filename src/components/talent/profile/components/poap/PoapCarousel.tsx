
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { type Poap } from '@/api/services/poapService';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({
  poaps,
  onPoapClick,
  onCarouselChange
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (onCarouselChange) {
      onCarouselChange(currentIndex);
    }
  }, [currentIndex, onCarouselChange]);

  const nextPoap = () => {
    setCurrentIndex((prev) => (prev + 1) % poaps.length);
  };

  const prevPoap = () => {
    setCurrentIndex((prev) => (prev - 1 + poaps.length) % poaps.length);
  };

  if (poaps.length === 0) return null;

  const currentPoap = poaps[currentIndex];

  return (
    <div className="relative flex items-center justify-center">
      {/* Previous Button */}
      {poaps.length > 1 && (
        <button
          onClick={prevPoap}
          className="absolute left-0 bottom-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Previous POAP"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* POAP Image with Rainbow Border */}
      <div 
        className="cursor-pointer transition-transform hover:scale-105 relative"
        onClick={() => onPoapClick(currentPoap)}
      >
        <div className="relative">
          <style>{`
            @keyframes rainbow-fade {
              0% { 
                border-color: #ff0000;
                opacity: 0.8;
              }
              14% { 
                border-color: #ff7300;
                opacity: 1;
              }
              28% { 
                border-color: #fffb00;
                opacity: 0.9;
              }
              42% { 
                border-color: #48ff00;
                opacity: 1;
              }
              56% { 
                border-color: #00ffd5;
                opacity: 0.8;
              }
              70% { 
                border-color: #002bff;
                opacity: 1;
              }
              84% { 
                border-color: #7a00ff;
                opacity: 0.9;
              }
              100% { 
                border-color: #ff0000;
                opacity: 0.8;
              }
            }
          `}</style>
          <img
            src={currentPoap.event.image_url}
            alt={currentPoap.event.name}
            className="w-80 h-80 rounded-full object-cover shadow-lg"
            style={{
              border: '6px solid #ff0000',
              animation: 'rainbow-fade 3s ease-in-out infinite'
            }}
          />
        </div>
      </div>

      {/* Next Button */}
      {poaps.length > 1 && (
        <button
          onClick={nextPoap}
          className="absolute right-0 bottom-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Next POAP"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Dots Indicator */}
      {poaps.length > 1 && (
        <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {poaps.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-gray-800' : 'bg-gray-300'
              }`}
              aria-label={`Go to POAP ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;
