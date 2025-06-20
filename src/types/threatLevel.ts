
// Define a consistent ThreatLevel type to be used across the application
export type ThreatLevel = 'Unknown' | 'Low' | 'Medium' | 'High';

// Map from the API threat level strings to our application ThreatLevel type
export const mapThreatLevel = (apiThreatLevel?: string): ThreatLevel => {
  if (!apiThreatLevel) return 'Unknown';
  
  switch (apiThreatLevel.toUpperCase()) {
    case 'LOW':
      return 'Low';
    case 'MEDIUM':
      return 'Medium';
    case 'HIGH':
      return 'High';
    default:
      return 'Unknown';
  }
};
