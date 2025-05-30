
import { SocialPlatform } from '@/constants/socialPlatforms';
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

// LinkedIn API credentials
const CLIENT_ID = '78tbmy2vayozmc';
const CLIENT_SECRET = 'WPL_AP1.UZZde4p0GU2HWbzY.QWNWog==';

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
    // Remove any leading/trailing whitespace
    const cleanValue = linkedinValue.trim();
    
    // Handle direct username format (no URL, no special characters)
    if (!cleanValue.includes('/') && !cleanValue.includes('.') && !cleanValue.includes('@')) {
      console.log('Using direct username format:', cleanValue);
      return cleanValue;
    }
    
    // Handle @username format
    if (cleanValue.startsWith('@')) {
      const username = cleanValue.substring(1).trim();
      console.log('Extracted from @-prefix format:', username);
      return username || null;
    }
    
    // Handle full LinkedIn URL formats
    if (cleanValue.includes('linkedin.com/in/')) {
      const parts = cleanValue.split('linkedin.com/in/');
      const username = parts[1]?.split(/[/?#]/)[0];
      console.log('Extracted from full LinkedIn URL:', username);
      return username?.trim() || null;
    }
    
    // Handle shortened /in/ format
    if (cleanValue.includes('/in/')) {
      const parts = cleanValue.split('/in/');
      const username = parts[1]?.split(/[/?#]/)[0];
      console.log('Extracted from /in/ format:', username);
      return username?.trim() || null;
    }
    
    // Handle linkedin:// scheme
    if (cleanValue.startsWith('linkedin://')) {
      const username = cleanValue.replace('linkedin://', '').split(/[/?#]/)[0];
      console.log('Extracted from linkedin:// scheme:', username);
      return username?.trim() || null;
    }
    
    // If it looks like a URL but doesn't match our patterns, try to extract username
    if (cleanValue.includes('linkedin')) {
      // Try to find anything that looks like a username after linkedin
      const match = cleanValue.match(/linkedin[^\/]*\/+(?:in\/)?([^\/\?#\s]+)/i);
      if (match && match[1]) {
        console.log('Extracted using regex pattern:', match[1]);
        return match[1].trim();
      }
    }
    
    console.log('Using the value directly as handle:', cleanValue);
    return cleanValue;
  } catch (error) {
    console.error('Error extracting LinkedIn handle:', error);
    return null;
  }
};

/**
 * Generate mock LinkedIn experience data based on handle
 * @param handle LinkedIn handle
 * @returns Array of mock work experiences
 */
const generateMockExperience = (handle: string): LinkedInJob[] => {
  // Personalize mock data based on the handle
  if (handle.includes('franklyn') || handle === '30315-eth' || handle === '30315eth' || handle.toLowerCase().includes('reon')) {
    return [
      {
        id: '1',
        company: 'TalentDAO',
        role: 'Web3 Developer',
        startDate: '2023-01',
        endDate: null, // Current position
        description: 'Leading blockchain integration and smart contract development. Building decentralized talent marketplace and reputation systems using Solidity, React, and Node.js.',
        location: 'Remote'
      },
      {
        id: '2',
        company: 'DecentraVerse Labs',
        role: 'Senior Frontend Engineer',
        startDate: '2021-06',
        endDate: '2022-12',
        description: 'Developed and maintained React applications for NFT marketplace and DeFi protocols. Integrated wallet connections and on-chain transactions using ethers.js and web3.js.',
        location: 'San Francisco, CA'
      },
      {
        id: '3',
        company: 'Ethereum Foundation',
        role: 'Research Contributor',
        startDate: '2020-03',
        endDate: '2021-05',
        description: 'Contributed to research on layer 2 scaling solutions and governance mechanisms. Participated in community calls and documentation efforts for EIP standards.',
        location: 'Berlin, Germany'
      }
    ];
  } else {
    // Generic data for other handles
    return [
      {
        id: '1',
        company: 'Web3 Innovations Ltd',
        role: 'Senior Blockchain Developer',
        startDate: '2022-06',
        endDate: null, // Current position
        description: 'Leading smart contract development and integration with frontend applications. Implementing ERC standards and optimizing gas usage for decentralized applications.',
        location: 'Remote'
      },
      {
        id: '2',
        company: 'Crypto Protocol Inc',
        role: 'Protocol Researcher',
        startDate: '2020-03',
        endDate: '2022-05',
        description: 'Researched layer 2 scaling solutions including optimistic rollups and zk-rollups. Contributed to protocol specifications and proof of concept implementations.',
        location: 'London, UK'
      },
      {
        id: '3',
        company: 'DeFi Solutions',
        role: 'Frontend Engineer',
        startDate: '2018-09',
        endDate: '2020-02',
        description: 'Built responsive web3 interfaces for decentralized finance applications. Integrated wallet connections and implemented user-friendly transaction flows.',
        location: 'Austin, TX'
      }
    ];
  }
};

/**
 * Fetch LinkedIn work experience for a user
 * This currently returns mock data but follows the structure for real API integration
 * @param handle LinkedIn handle
 * @returns Array of user's work experiences
 */
export const fetchLinkedInExperience = async (handle: string): Promise<LinkedInJob[]> => {
  console.log(`Fetching LinkedIn experience for handle: ${handle}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  try {
    // In a real implementation, this would call the LinkedIn API
    // For now, we return personalized mock data
    const mockJobs = generateMockExperience(handle);
    
    console.log(`Successfully fetched ${mockJobs.length} LinkedIn jobs for ${handle}`);
    return mockJobs.slice(0, 3); // Return only the 3 most recent jobs
  } catch (error) {
    console.error(`Error fetching LinkedIn experience for ${handle}:`, error);
    throw new Error('Failed to fetch LinkedIn experience');
  }
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
      console.log('LinkedIn social data received:', socials?.linkedin);
      
      if (!socials?.linkedin) {
        console.log('No LinkedIn profile found in socials data');
        setExperience([]);
        return;
      }
      
      const linkedinHandle = extractLinkedInHandle(socials.linkedin);
      
      if (!linkedinHandle) {
        console.log('No valid LinkedIn handle could be extracted');
        setExperience([]);
        return;
      }
      
      console.log(`Starting to fetch LinkedIn experience for handle: ${linkedinHandle}`);
      setIsLoading(true);
      setError(null);
      
      try {
        const jobs = await fetchLinkedInExperience(linkedinHandle);
        console.log('LinkedIn experience fetched successfully:', jobs);
        setExperience(jobs);
      } catch (err) {
        console.error('Error fetching LinkedIn experience:', err);
        const errorMessage = 'Failed to fetch work experience from LinkedIn';
        setError(errorMessage);
        setExperience([]);
        
        toast({
          title: "LinkedIn Data Error",
          description: "Could not retrieve work experience data from LinkedIn",
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
