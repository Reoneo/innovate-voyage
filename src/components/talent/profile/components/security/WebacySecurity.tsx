
import React, { useState } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import ThreatLevelCard from './components/ThreatLevelCard';
import SecurityDialogContent from './components/SecurityDialogContent';
import { useWebacyData } from './hooks/useWebacyData';

interface WebacySecurityProps {
  walletAddress?: string;
}

const WebacySecurity: React.FC<WebacySecurityProps> = ({ walletAddress }) => {
  return null;
};

export default WebacySecurity;
