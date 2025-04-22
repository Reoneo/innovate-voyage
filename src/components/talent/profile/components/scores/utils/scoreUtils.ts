
import { ThreatLevel } from '../types';

export const getBuilderTitle = (score: number) => {
  if (score >= 800) return 'Expert Builder';
  if (score >= 600) return 'Advanced Builder';
  if (score >= 400) return 'Intermediate Builder';
  if (score >= 200) return 'Growing Builder';
  return 'Beginner Builder';
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
