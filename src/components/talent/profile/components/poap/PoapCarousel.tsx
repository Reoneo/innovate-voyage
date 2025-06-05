
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
  const [startX, setStartX] = useState<number | null>(null);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX) return;
    
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    
    if (Math.abs(diff) > 50) { // Minimum swipe distance
      if (diff > 0) {
        nextPoap();
      } else {
        prevPoap();
      }
    }
    
    setStartX(null);
  };

  if (poaps.length === 0) return null;

  const currentPoap = poaps[currentIndex];

  return (
    <>
      <style>
        {`
          @keyframes rainbow-spin {
            0% { 
              background: conic-gradient(from 0deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            }
            25% { 
              background: conic-gradient(from 90deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            }
            50% { 
              background: conic-gradient(from 180deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            }
            75% { 
              background: conic-gradient(from 270deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            }
            100% { 
              background: conic-gradient(from 360deg, #ff0000, #ff7300, #fffb00, #48ff00, #00ffd5, #002bff, #7a00ff, #ff00c8, #ff0000);
            }
          }
          
          .rainbow-border {
            position: relative;
            border-radius: 50%;
            animation: rainbow-spin 3s linear infinite;
            padding: 3px;
            width: 200px;
            height: 200px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .rainbow-border img {
            display: block;
            border-radius: 50%;
            width: 194px;
            height: 194px;
            object-fit: cover;
          }
        `}
      </style>
      <div className="relative flex items-center justify-center">
        {/* Previous Button */}
        {poaps.length > 1 && (
          <button
            onClick={prevPoap}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Previous POAP"
          >
            <ChevronLeft className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* POAP Image with Rainbow Border - Reduced by 20% and touch enabled */}
        <div 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => onPoapClick(currentPoap)}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="rainbow-border">
            <img
              src={currentPoap.event.image_url}
              alt={currentPoap.event.name}
              className="shadow-lg"
            />
          </div>
        </div>

        {/* Next Button */}
        {poaps.length > 1 && (
          <button
            onClick={nextPoap}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 p-2 rounded-full bg-white shadow-lg hover:bg-gray-50 transition-colors"
            aria-label="Next POAP"
          >
            <ChevronRight className="h-5 w-5 text-gray-600" />
          </button>
        )}

        {/* Dots Indicator */}
        {poaps.length > 1 && (
          <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
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
    </>
  );
};

export default PoapCarousel;
