export function getBuilderTitle(score: number): string {
  if (score >= 90) {
    return 'Legendary Builder';
  } else if (score >= 80) {
    return 'Epic Builder';
  } else if (score >= 70) {
    return 'Master Builder';
  } else if (score >= 60) {
    return 'Great Builder';
  } else if (score >= 50) {
    return 'Skilled Builder';
  } else if (score >= 40) {
    return 'Promising Builder';
  } else {
    return 'New Builder';
  }
}

export function getThreatColor(threatLevel?: string): string {
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
}
