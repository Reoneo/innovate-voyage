import React, { useEffect, useState } from 'react';
import { Poap } from '@/api/services/poapService';
import { CarouselApi } from "@/components/ui/carousel";
import { usePoapTheme } from './hooks/usePoapTheme';
import SinglePoapDisplay from './SinglePoapDisplay';
import PoapCarouselControls from './PoapCarouselControls';
import PoapMainCarousel from './PoapMainCarousel';

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
  const themeColors = usePoapTheme(userAvatarUrl);

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

    updateState(); // Initial state
    api.on("select", updateState); // Listen for changes

    return () => {
      api.off("select", updateState); // Cleanup
    };
  }, [api, onCarouselChange]);

  // Show single POAP without carousel for single items
  if (!poaps || poaps.length <= 1) {
    return <SinglePoapDisplay poaps={poaps} onPoapClick={onPoapClick} />;
  }

  // For large collections, show dots only for first 10 items and use counter
  const shouldShowDots = poaps.length <= 10;

  return (
    <div className="relative w-full max-w-sm mx-auto">
      <PoapMainCarousel
        poaps={poaps}
        onPoapClick={onPoapClick}
        setApi={setApi}
      />
      <PoapCarouselControls
        api={api}
        current={current}
        poapsCount={poaps.length}
        canScrollPrev={canScrollPrev}
        canScrollNext={canScrollNext}
        themeColors={themeColors}
        shouldShowDots={shouldShowDots}
      />
    </div>
  );
};

export default PoapCarousel;
