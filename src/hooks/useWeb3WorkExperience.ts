
import { useState } from 'react';

interface WorkExperience {
  company: string;
  role: string;
  start_date: string;
  end_date: string | null;
  verified: boolean;
  description?: string;
}

export function useWeb3WorkExperience(walletAddress?: string) {
  const [experience] = useState<WorkExperience[]>([]);
  const [isLoading] = useState(false);
  const [error] = useState<string | null>(null);

  return {
    experience,
    isLoading,
    error
  };
}
