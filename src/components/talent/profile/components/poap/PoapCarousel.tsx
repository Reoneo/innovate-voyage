
import React from 'react';
import { Poap } from '@/api/services/poapService';
import { useIsMobile } from '@/hooks/use-mobile';
import PoapGrid from './PoapGrid';
import PoapCarouselDesktop from './PoapCarouselDesktop';

interface PoapCarouselProps {
  poaps: Poap[];
  onPoapClick: (poap: Poap) => void;
  onCarouselChange?: (index: number) => void;
  userAvatarUrl?: string;
}

const PoapCarousel: React.FC<PoapCarouselProps> = ({
  poaps,
  onPoapClick,
  onCarouselChange
}) => {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <PoapGrid poaps={poaps} onPoapClick={onPoapClick} />;
  }

  return <PoapCarouselDesktop poaps={poaps} onPoapClick={onPoapClick} onCarouselChange={onCarouselChange} />;
};

export default PoapCarousel;
