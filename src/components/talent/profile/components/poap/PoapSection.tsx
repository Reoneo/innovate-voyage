import React, { useState } from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type Poap } from '@/api/services/poapService';
import PoapCard from './PoapCard';
import PoapDetailContent from './PoapDetailContent';
import { usePoapData } from './usePoapData';
interface PoapSectionProps {
  walletAddress?: string;
}
const PoapSection: React.FC<PoapSectionProps> = ({
  walletAddress
}) => {
  const [detailOpen, setDetailOpen] = useState(false);
  const {
    poaps,
    isLoading,
    currentPoapIndex,
    setCurrentPoapIndex,
    selectedPoap,
    setSelectedPoap,
    poapOwners,
    loadingOwners,
    loadPoapOwners
  } = usePoapData(walletAddress);

  // Handler for opening POAP details
  const handleOpenDetail = (poap: Poap) => {
    setSelectedPoap(poap);
    setDetailOpen(true);
    loadPoapOwners(poap.event.id);
  };

  // Navigation handlers
  const handlePrevious = () => {
    setCurrentPoapIndex(prev => prev > 0 ? prev - 1 : poaps.length - 1);
  };
  const handleNext = () => {
    setCurrentPoapIndex(prev => prev < poaps.length - 1 ? prev + 1 : 0);
  };
  if (!walletAddress) return null;
  if (poaps.length === 0 && !isLoading) return null;
  return;
};
export default PoapSection;