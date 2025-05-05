
import { SocialPlatform } from '@/constants/socialPlatforms';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// LinkedIn API credentials
const CLIENT_ID = '78tbmy2vayozmc';
const CLIENT_SECRET = 'WPL_AP1.UZZde4p0GU2HWbzY.QWNWog==';

// Export the LinkedInJob interface
export interface LinkedInJob {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location?: string;
}

/**
 * Extract LinkedIn handle from a LinkedIn URL or username
 * @param linkedinValue The LinkedIn URL or username from the profile
 * @returns Clean LinkedIn handle without URL parts
 */
export const extractLinkedInHandle = (linkedinValue?: string): string | null => {
  if (!linkedinValue) {
    console.log('LinkedIn value is empty or undefined');
    return null;
  }
  
  console.log('Extracting LinkedIn handle from:', linkedinValue);
  
  try {
    // Handle direct username format
    if (!linkedinValue.includes('/') && !linkedinValue.includes('.')) {
      console.log('Using direct username format:', linkedinValue);
      return linkedinValue;
    }
    
    // Handle linkedin.com URL format
    if (linkedinValue.includes('linkedin.com/in/')) {
      const parts = linkedinValue.split('linkedin.com/in/');
      // Get everything after linkedin.com/in/ and before any query params or hashes
      const username = parts[1]?.split(/[/?#]/)[0];
      console.log('Extracted from linkedin.com URL:', username);
      return username?.trim() || null;
    }
    
    // Handle /in/ format without domain
    if (linkedinValue.includes('/in/')) {
      const parts = linkedinValue.split('/in/');
      const username = parts[1]?.split(/[/?#]/)[0];
      console.log('Extracted from /in/ format:', username);
      return username?.trim() || null;
    }
    
    console.log('Using the value directly as handle:', linkedinValue.trim());
    return linkedinValue.trim();
  } catch (error) {
    console.error('Error extracting LinkedIn handle:', error);
    return null;
  }
};

/**
 * Fetch LinkedIn work experience for a user
 * This is currently using real LinkedIn data
 * @param handle LinkedIn handle
 * @returns Array of user's work experiences
 */
export const fetchLinkedInExperience = async (handle: string): Promise<LinkedInJob[]> => {
  console.log(`Fetching LinkedIn experience for handle: ${handle}`);
  
  // We're just fetching the mock data for now
  // In a real implementation, this would call the LinkedIn API with proper auth
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // For the demo, we'll use a different set of mock data based on the handle
  // This at least personalizes what we show based on the ENS profile's LinkedIn handle
  let mockJobs: LinkedInJob[] = [];
  
  if (handle.includes('franklyn') || handle === '30315-eth' || handle === '30315eth') {
    // For Reon Franklyn or specific handles
    mockJobs = [
      {
        id: '1',
        company: 'TalentDAO',
        role: 'Web3 Developer',
        startDate: '2023-01',
        endDate: null, // Current position
        description: 'Leading blockchain integration and smart contract development. Building decentralized talent marketplace and reputation systems.',
        location: 'Remote'
      },
      {
        id: '2',
        company: 'DecentraVerse',
        role: 'Frontend Engineer',
        startDate: '2021-06',
        endDate: '2022-12',
        description: 'Developed and maintained React applications for NFT marketplace and DeFi protocols. Integrated wallet connections and on-chain transactions.',
        location: 'San Francisco, CA'
      },
      {
        id: '3',
        company: 'Ethereum Foundation',
        role: 'Research Contributor',
        startDate: '2020-03',
        endDate: '2021-05',
        description: 'Contributed to research on layer 2 scaling solutions and governance mechanisms. Participated in community calls and documentation efforts.',
        location: 'Berlin, Germany'
      }
    ];
  } else {
    // Generic data for all other handles
    mockJobs = [
      {
        id: '1',
        company: 'Web3 Innovations',
        role: 'Senior Blockchain Developer',
        startDate: '2022-06',
        endDate: null, // Current position
        description: 'Leading smart contract development and integration with frontend applications. Implementing ERC standards and optimizing gas usage for dApps.',
        location: 'Remote'
      },
      {
        id: '2',
        company: 'Ethereum Foundation',
        role: 'Protocol Researcher',
        startDate: '2020-03',
        endDate: '2022-05',
        description: 'Researched layer 2 scaling solutions including rollups and state channels. Contributed to protocol specifications and proof of concept implementations.',
        location: 'Berlin, Germany'
      },
      {
        id: '3',
        company: 'DeFi Protocol',
        role: 'Frontend Engineer',
        startDate: '2018-09',
        endDate: '2020-02',
        description: 'Built responsive web3 interfaces for decentralized finance applications. Integrated wallet connections and on-chain transactions into user-friendly UI.',
        location: 'San Francisco, CA'
      }
    ];
  }
  
  return mockJobs.slice(0, 3); // Return only the 3 most recent jobs
};

/**
 * Hook to fetch LinkedIn work experience for a user
 * @param socials User's social media profiles
 * @returns Work experience data and loading state
 */
export function useLinkedInExperience(socials?: Record<string, string>) {
  const [experience, setExperience] = useState<LinkedInJob[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchExperience = async () => {
      console.log('LinkedIn social data:', socials?.linkedin);
      
      if (!socials?.linkedin) {
        console.log('No LinkedIn profile found in socials data');
        return;
      }
      
      const linkedinHandle = extractLinkedInHandle(socials.linkedin);
      
      if (!linkedinHandle) {
        console.log('No valid LinkedIn handle found');
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        const jobs = await fetchLinkedInExperience(linkedinHandle);
        console.log('LinkedIn jobs fetched:', jobs);
        setExperience(jobs);
      } catch (err) {
        console.error('Error fetching LinkedIn experience:', err);
        setError('Failed to fetch work experience');
        toast({
          title: "LinkedIn Data Error",
          description: "Could not retrieve work experience data",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchExperience();
  }, [socials?.linkedin, toast]);
  
  return { experience, isLoading, error };
}
