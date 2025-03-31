
import { useState } from 'react';
import { getSecret } from '@/utils/secrets';

interface UseDopplerOptions {
  projectName?: string;
}

export function useDoppler(options: UseDopplerOptions = {}) {
  const { projectName = 'default' } = options;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  
  const apiKey = getSecret('DOPPLER_API_KEY');
  
  const fetchSecrets = async () => {
    if (!apiKey) {
      setError(new Error('Doppler API key not found'));
      return null;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`https://api.doppler.com/v3/configs/config/secrets`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`Doppler API error: ${response.status}`);
      }
      
      const data = await response.json();
      setIsLoading(false);
      return data;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'));
      setIsLoading(false);
      return null;
    }
  };
  
  return {
    fetchSecrets,
    isLoading,
    error,
    hasApiKey: !!apiKey
  };
}
