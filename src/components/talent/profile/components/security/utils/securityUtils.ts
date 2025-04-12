
import { ThreatLevel } from '../hooks/useWebacyData';

/**
 * Get the appropriate background color class for a threat level
 */
export const getThreatBgColor = (level?: ThreatLevel) => {
  switch (level) {
    case 'LOW': return 'bg-green-100 text-green-700';
    case 'MEDIUM': return 'bg-yellow-100 text-yellow-700';
    case 'HIGH': return 'bg-red-100 text-red-700';
    default: return 'bg-gray-100 text-gray-700';
  }
};

/**
 * Get the appropriate text color for a threat level
 */
export const getThreatColor = (level?: ThreatLevel) => {
  switch (level) {
    case 'LOW': return 'text-green-500';
    case 'MEDIUM': return 'text-yellow-500';
    case 'HIGH': return 'text-red-500';
    default: return 'text-gray-500';
  }
};

/**
 * Get a description for a threat level
 */
export const getThreatDescription = (level?: ThreatLevel) => {
  switch (level) {
    case 'LOW': return 'This wallet is safe and poses low to no risk to others.';
    case 'MEDIUM': return 'This wallet has some suspicious activity and poses a moderate risk.';
    case 'HIGH': return 'This wallet has highly suspicious activity and poses a significant risk.';
    default: return 'Unable to determine the security level of this wallet.';
  }
};
