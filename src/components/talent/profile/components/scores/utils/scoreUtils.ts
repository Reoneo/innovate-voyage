
import { ThreatLevel } from '../types';

// Updated according to request
export const getBuilderTitle = (score: number) => {
  if (score >= 250) return 'Master';
  if (score >= 170) return 'Expert';
  if (score >= 120) return 'Advanced';
  if (score >= 80) return 'Practitioner';
  if (score >= 40) return 'Apprentice';
  if (score >= 0) return 'Novice';
  return 'Novice';
};

export const getThreatLevel = (riskScore?: number): ThreatLevel => {
  if (riskScore === undefined) return 'UNKNOWN';
  if (riskScore < 30) return 'LOW';
  if (riskScore < 70) return 'MEDIUM';
  return 'HIGH';
};

export const getThreatColor = (level?: ThreatLevel) => {
  switch (level) {
    case 'LOW': return 'text-green-500';
    case 'MEDIUM': return 'text-yellow-500';
    case 'HIGH': return 'text-red-500';
    default: return 'text-gray-500';
  }
};
