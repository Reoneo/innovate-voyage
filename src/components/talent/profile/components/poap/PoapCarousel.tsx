
import React from 'react';
import { Poap } from '@/api/services/poapService';
import PoapCarouselComponent from './PoapCarouselComponent';

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
  return <PoapCarouselComponent poaps={poaps} onPoapClick={onPoapClick} onCarouselChange={onCarouselChange} />;
};

export default PoapCarousel;
