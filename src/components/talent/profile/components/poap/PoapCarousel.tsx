
import React, { useState, useEffect } from 'react';
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
    setCurrentIndex(prev => (prev + 1) % poaps.length);
  };

  const prevPoap = () => {
    setCurrentIndex(prev => (prev - 1 + poaps.length) % poaps.length);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!startX) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
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
            width: 160px;
            height: 160px;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .rainbow-border img {
            display: block;
            border-radius: 50%;
            width: 154px;
            height: 154px;
            object-fit: cover;
          }
          
          .swipe-indicator {
            opacity: 0.6;
            transition: opacity 0.3s ease;
          }
          
          .swipe-indicator:hover {
            opacity: 1;
          }
        `}
      </style>
      <div className="relative flex flex-col items-center justify-center">
        {/* POAP Image with Rainbow Border */}
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

        {/* Swipe Indicator */}
        {poaps.length > 1 && (
          <div className="mt-3 flex items-center gap-2 text-xs text-gray-500 swipe-indicator">
            <span>←</span>
            <span>Swipe to browse</span>
            <span>→</span>
          </div>
        )}

        {/* Dots Indicator */}
        {poaps.length > 1 && (
          <div className="mt-2 flex space-x-2">
            {poaps.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentIndex ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default PoapCarousel;
