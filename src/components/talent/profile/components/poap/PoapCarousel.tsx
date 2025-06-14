
import React, { useCallback, useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { Carousel, CarouselContent, CarouselItem, CarouselApi } from "@/components/ui/carousel";
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ColorThief from 'colorthief';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
  userAvatarUrl?: string;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({
  poaps,
  onPoapClick,
  onCarouselChange,
  userAvatarUrl
}) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [themeColors, setThemeColors] = useState({
    primary: '#7856FF',
    primaryHover: '#6B46C1',
    secondary: '#E5E7EB',
    secondaryHover: '#9CA3AF'
  });

  // Extract theme colors from user avatar
  useEffect(() => {
    const extractThemeColors = async () => {
      if (!userAvatarUrl) return;
      
      try {
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        
        img.onload = () => {
          try {
            const colorThief = new ColorThief();
            const dominantColor = colorThief.getColor(img);
            const palette = colorThief.getPalette(img, 3);
            
            if (dominantColor && palette) {
              const primaryRgb = dominantColor;
              const secondaryRgb = palette[1] || palette[0];
              
              // Convert RGB to hex
              const rgbToHex = (r: number, g: number, b: number) => 
                `#${[r, g, b].map(x => x.toString(16).padStart(2, '0')).join('')}`;
              
              // Create darker variant for hover
              const darkenColor = (r: number, g: number, b: number, factor = 0.8): [number, number, number] => 
                [Math.floor(r * factor), Math.floor(g * factor), Math.floor(b * factor)];
              
              const primary = rgbToHex(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
              const darkenedPrimary = darkenColor(primaryRgb[0], primaryRgb[1], primaryRgb[2]);
              const primaryHover = rgbToHex(darkenedPrimary[0], darkenedPrimary[1], darkenedPrimary[2]);
              const secondary = rgbToHex(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
              const darkenedSecondary = darkenColor(secondaryRgb[0], secondaryRgb[1], secondaryRgb[2]);
              const secondaryHover = rgbToHex(darkenedSecondary[0], darkenedSecondary[1], darkenedSecondary[2]);
              
              setThemeColors({
                primary,
                primaryHover,
                secondary,
                secondaryHover
              });
            }
          } catch (error) {
            console.error('Error extracting colors from avatar:', error);
          }
        };
        
        img.src = userAvatarUrl;
      } catch (error) {
        console.error('Error loading avatar for color extraction:', error);
      }
    };

    extractThemeColors();
  }, [userAvatarUrl]);

  useEffect(() => {
    if (!api) {
      return;
    }

    const updateState = () => {
      const currentIndex = api.selectedScrollSnap();
      setCurrent(currentIndex);
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
      onCarouselChange?.(currentIndex);
    };

    updateState();
    api.on("select", updateState);

    return () => {
      api.off("select", updateState);
    };
  }, [api, onCarouselChange]);

  // Show single POAP without carousel for single items
  if (poaps.length <= 1) {
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
  }

  // For large collections, show dots only for first 10 items and use counter
  const shouldShowDots = poaps.length <= 10;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <Carousel 
        setApi={setApi}
        opts={{
          align: 'center',
          loop: poaps.length > 1,
          skipSnaps: false,
          dragFree: false,
          containScroll: 'trimSnaps'
        }} 
        className="w-full"
      >
        <CarouselContent className="-ml-2 md:-ml-4">
          {poaps.map((poap, index) => (
            <CarouselItem key={`${poap.tokenId}-${index}`} className="pl-2 md:pl-4 basis-full flex items-center justify-center">
              <div 
                className="relative cursor-pointer group w-40 h-40" 
                onClick={() => onPoapClick(poap)}
              >
                <img 
                  src={poap.event.image_url} 
                  alt={poap.event.name} 
                  className="w-full h-full rounded-full cursor-pointer z-10 p-2 object-contain" 
                  style={{
                    background: 'rgba(0,0,0,0.7)'
                  }} 
                  loading="lazy"
                />
                <div className="absolute inset-0 rounded-full border-4 border-transparent animate-rainbow-border"></div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      {/* Navigation Controls - Only show if more than 1 POAP */}
      {poaps.length > 1 && (
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
            style={canScrollPrev ? {
              backgroundColor: themeColors.primary
            } : {}}
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
              {poaps.map((_, index) => (
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
              <span>{poaps.length}</span>
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
            style={canScrollNext ? {
              backgroundColor: themeColors.primary
            } : {}}
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
      )}

      {/* Swipe Hint Text */}
      {poaps.length > 1 && (
        <div className="text-xs text-center mt-2 text-gray-500">
          Swipe, click arrows or dots to browse POAPs
        </div>
      )}
    </div>
  );
};

export default PoapCarousel;

