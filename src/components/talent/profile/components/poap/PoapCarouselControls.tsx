
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { CarouselApi } from "@/components/ui/carousel";

interface PoapCarouselControlsProps {
  api: CarouselApi | undefined;
  current: number;
  poapsCount: number;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  themeColors: {
    primary: string;
    primaryHover: string;
    secondary: string;
    secondaryHover: string;
  };
  shouldShowDots: boolean;
}

const PoapCarouselControls: React.FC<PoapCarouselControlsProps> = ({
  api,
  current,
  poapsCount,
  canScrollPrev,
  canScrollNext,
  themeColors,
  shouldShowDots,
}) => {
  if (poapsCount <= 1) {
    return null;
  }

  return (
    <>
      <div className="flex items-center justify-center mt-4 space-x-4">
        {/* Left Arrow */}
        <button
          onClick={() => {
            console.log('Previous clicked, canScrollPrev:', canScrollPrev);
            api?.scrollPrev();
          }}
          disabled={!canScrollPrev}
          className={`p-2 rounded-full transition-all ${
            canScrollPrev 
              ? 'text-white cursor-pointer shadow-lg hover:scale-105' 
              : 'text-gray-400 cursor-not-allowed bg-gray-100'
          }`}
          style={canScrollPrev ? { backgroundColor: themeColors.primary } : {}}
          onMouseEnter={(e) => {
            if (canScrollPrev) {
              e.currentTarget.style.backgroundColor = themeColors.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (canScrollPrev) {
              e.currentTarget.style.backgroundColor = themeColors.primary;
            }
          }}
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Indicator: Either dots or counter */}
        {shouldShowDots ? (
          <div className="flex space-x-2">
            {Array.from({ length: poapsCount }).map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  console.log('Dot clicked, scrolling to index:', index);
                  api?.scrollTo(index);
                }}
                className={`w-2 h-2 rounded-full transition-all ${
                  index === current 
                    ? 'scale-125' 
                    : 'hover:scale-110'
                }`}
                style={{
                  backgroundColor: index === current ? themeColors.primary : themeColors.secondary
                }}
                onMouseEnter={(e) => {
                  if (index !== current) {
                    e.currentTarget.style.backgroundColor = themeColors.secondaryHover;
                  }
                }}
                onMouseLeave={(e) => {
                  if (index !== current) {
                    e.currentTarget.style.backgroundColor = themeColors.secondary;
                  }
                }}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <span className="font-medium" style={{ color: themeColors.primary }}>
              {current + 1}
            </span>
            <span>/</span>
            <span>{poapsCount}</span>
          </div>
        )}

        {/* Right Arrow */}
        <button
          onClick={() => {
            console.log('Next clicked, canScrollNext:', canScrollNext);
            api?.scrollNext();
          }}
          disabled={!canScrollNext}
          className={`p-2 rounded-full transition-all ${
            canScrollNext 
              ? 'text-white cursor-pointer shadow-lg hover:scale-105' 
              : 'text-gray-400 cursor-not-allowed bg-gray-100'
          }`}
          style={canScrollNext ? { backgroundColor: themeColors.primary } : {}}
          onMouseEnter={(e) => {
            if (canScrollNext) {
              e.currentTarget.style.backgroundColor = themeColors.primaryHover;
            }
          }}
          onMouseLeave={(e) => {
            if (canScrollNext) {
              e.currentTarget.style.backgroundColor = themeColors.primary;
            }
          }}
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Swipe Hint Text */}
      {poapsCount > 1 && (
        <div className="text-xs text-center mt-2 text-gray-500">
          Swipe, click arrows or dots to browse POAPs
        </div>
      )}
    </>
  );
};

export default PoapCarouselControls;

