
// Get builder title based on talent score
export const getBuilderTitle = (score: number): string => {
  if (score >= 800) return 'Legendary Builder';
  if (score >= 600) return 'Expert Builder';
  if (score >= 400) return 'Advanced Builder';
  if (score >= 200) return 'Intermediate Builder';
  return 'Aspiring Builder';
};

// Get threat level based on security score
export const getThreatLevel = (score: number): 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN' => {
  if (score === undefined || score === null) return 'UNKNOWN';
  if (score < 30) return 'LOW';
  if (score < 70) return 'MEDIUM';
  return 'HIGH';
};

// Get color based on threat level
export const getThreatColor = (threatLevel?: 'LOW' | 'MEDIUM' | 'HIGH' | 'UNKNOWN'): string => {
  switch (threatLevel) {
    case 'LOW':
      return 'text-green-600';
    case 'MEDIUM':
      return 'text-yellow-600';
    case 'HIGH':
      return 'text-red-600';
    default:
      return 'text-gray-500';
  }
};
