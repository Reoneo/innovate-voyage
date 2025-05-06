
import { useState, useEffect } from 'react';

// Re-export the LinkedInJob interface from the component for use in other files
export type { LinkedInJob } from '@/components/talent/profile/components/LinkedInExperienceSection';

// Interface for work experience returned by the LinkedIn API
export interface LinkedInJob {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string | null;
  description?: string;
  location?: string;
}

/**
 * Hook to fetch LinkedIn work experience data
 * @param socials - Social media links object that may contain a LinkedIn profile
 * @returns Object containing experience data, loading state, and any errors
 */
export function useLinkedInExperience(socials?: Record<string, string>) {
  const [experience, setExperience] = useState<LinkedInJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLinkedInData = async () => {
      // Reset states
      setIsLoading(true);
      setError(null);
      
      try {
        // Check if there's a LinkedIn URL to process
        if (!socials?.linkedin) {
          // No LinkedIn URL found, so just finish loading with empty data
          setIsLoading(false);
          return;
        }
        
        // For now, we'll just return mock data since we don't have a real API
        // In a real implementation, this would fetch data from an API
        setTimeout(() => {
          // Mock data for demonstration
          const mockExperience: LinkedInJob[] = [
            {
              id: '1',
              role: 'Senior Blockchain Developer',
              company: 'Web3 Innovations',
              startDate: '2022-01',
              endDate: null, // Current position
              description: 'Leading development of smart contracts and dApps. Specializing in Solidity and EVM-compatible chains.',
              location: 'Remote'
            },
            {
              id: '2',
              role: 'Full Stack Engineer',
              company: 'Tech Solutions Inc.',
              startDate: '2019-05',
              endDate: '2021-12',
              description: 'Built responsive web applications using React and NodeJS. Integrated with various APIs and payment systems.',
              location: 'San Francisco, CA'
            }
          ];
          
          setExperience(mockExperience);
          setIsLoading(false);
        }, 1000);
        
      } catch (err) {
        console.error('Error fetching LinkedIn data:', err);
        setError('Failed to fetch work experience data');
        setIsLoading(false);
      }
    };
    
    fetchLinkedInData();
  }, [socials?.linkedin]);
  
  return { experience, isLoading, error };
}
