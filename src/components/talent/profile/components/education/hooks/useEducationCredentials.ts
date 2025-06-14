
import { useState, useEffect } from 'react';
import { EducationalCredential } from '../types';
import { fetchEducationCredentials } from '../services/educationCredentialsService';

export function useEducationCredentials(walletAddress?: string) {
  const [credentials, setCredentials] = useState<EducationalCredential[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchCredentials = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const fetchedCredentials = await fetchEducationCredentials(walletAddress);
        setCredentials(fetchedCredentials);
      } catch (err) {
        console.error('Error fetching education credentials:', err);
        setError('Failed to fetch education credentials');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCredentials();
  }, [walletAddress]);

  return { credentials, isLoading, error };
}
