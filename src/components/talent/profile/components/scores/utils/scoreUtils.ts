
import { ThreatLevel } from '../types';

export const getThreatColor = (threatLevel?: ThreatLevel) => {
  switch (threatLevel) {
    case 'LOW':
      return 'text-green-500';
    case 'MEDIUM':
      return 'text-yellow-500';
    case 'HIGH':
      return 'text-red-500';
    default:
      return 'text-gray-500';
  }
};

export const getBuilderTitle = (score: number) => {
  if (score >= 90) return 'Legendary Builder';
  if (score >= 80) return 'Expert Builder';
  if (score >= 70) return 'Skilled Builder';
  if (score >= 60) return 'Growing Builder';
  if (score >= 50) return 'Emerging Builder';
  if (score >= 40) return 'Learning Builder';
  if (score >= 30) return 'Building Experience';
  if (score >= 20) return 'Just Starting';
  return 'New Builder';
};
