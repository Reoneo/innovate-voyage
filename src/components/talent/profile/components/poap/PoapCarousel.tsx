
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
          className="absolute left-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Previous POAP"
        >
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* POAP Image */}
      <div 
        className="cursor-pointer transition-transform hover:scale-105"
        onClick={() => onPoapClick(currentPoap)}
      >
        <img
          src={currentPoap.event.image_url}
          alt={currentPoap.event.name}
          className="w-52 h-52 rounded-full object-cover shadow-lg border-4 border-white"
        />
      </div>

      {/* Next Button */}
      {poaps.length > 1 && (
        <button
          onClick={nextPoap}
          className="absolute right-0 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
          aria-label="Next POAP"
        >
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      )}

      {/* Dots Indicator */}
      {poaps.length > 1 && (
        <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
