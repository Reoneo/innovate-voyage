
export function getBuilderTitle(score: number): string {
  if (score >= 250) {
    return 'Master';
  } else if (score >= 170) {
    return 'Expert';
  } else if (score >= 120) {
    return 'Advanced';
  } else if (score >= 80) {
    return 'Practitioner';
  } else if (score >= 40) {
    return 'Apprentice';
  } else {
    return 'Novice';
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
