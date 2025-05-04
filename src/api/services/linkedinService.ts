
import { useState, useEffect } from 'react';
import { delay } from '../jobsApi';

interface LinkedInExperience {
  id: string;
  company: string;
  title: string;
  logo?: string;
  startDate: string;
  endDate?: string;
  description?: string;
  location?: string;
  skills?: string[];
  url?: string;
}

// Mock LinkedIn data for demo purposes
const mockLinkedInExperience: LinkedInExperience[] = [
  {
    id: '1',
    company: 'Blockchain Innovations',
    title: 'Senior Blockchain Developer',
    logo: 'https://picsum.photos/seed/blockchain/200',
    startDate: '2021-06',
    endDate: 'Present',
    description: 'Lead development of smart contracts and decentralized applications.',
    location: 'Remote',
    skills: ['Solidity', 'ERC Standards', 'Smart Contracts'],
    url: 'https://linkedin.com/company/blockchain-innovations'
  },
  {
    id: '2',
    company: 'Web3 Solutions',
    title: 'Frontend Developer',
    logo: 'https://picsum.photos/seed/web3/200',
    startDate: '2019-03',
    endDate: '2021-05',
    description: 'Developed user interfaces for DeFi applications.',
    location: 'San Francisco, CA',
    skills: ['React', 'TypeScript', 'Web3.js'],
    url: 'https://linkedin.com/company/web3-solutions'
  },
  {
    id: '3',
    company: 'Crypto Startup',
    title: 'Blockchain Consultant',
    logo: 'https://picsum.photos/seed/crypto/200',
    startDate: '2018-01',
    endDate: '2019-02',
    description: 'Provided technical consulting for blockchain integration projects.',
    location: 'New York, NY',
    skills: ['Blockchain Architecture', 'Tokenomics', 'Security Audits'],
    url: 'https://linkedin.com/company/crypto-startup'
  }
];

/**
 * Extract LinkedIn username or ID from different LinkedIn URL formats or plain usernames
 */
export function extractLinkedInIdentifier(linkedinValue: string | undefined): string | null {
  if (!linkedinValue) {
    return null;
  }

  const value = linkedinValue.trim();
  
  // Already a clean username (no URL)
  if (!value.includes('/') && !value.includes('.')) {
    return value;
  }
  
  // Try to extract from various URL formats
  try {
    // Handle linkedin.com/in/username format
    if (value.includes('linkedin.com/in/')) {
      const parts = value.split('linkedin.com/in/');
      return parts[1]?.split(/[/?#]/)[0] || null;
    }
    
    // Handle other common LinkedIn URL patterns
    if (value.includes('/profile/')) {
      const parts = value.split('/profile/');
      return parts[1]?.split(/[/?#]/)[0] || null;
    }
    
    // Handle just the username part
    if (value.startsWith('@')) {
      return value.substring(1);
    }
  } catch (error) {
    console.error('Error extracting LinkedIn identifier:', error);
  }
  
  // If nothing matched, return the original value as fallback
  return value;
}

/**
 * Hook to fetch LinkedIn experience data
 * Fixed to ensure consistent hook usage pattern
 */
export function useLinkedInExperience(socials?: Record<string, string> | null) {
  const [experience, setExperience] = useState<LinkedInExperience[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Always define the LinkedIn identifier outside useEffect to maintain hook call consistency
  const linkedinIdentifier = socials?.linkedin ? extractLinkedInIdentifier(socials.linkedin) : null;

  useEffect(() => {
    // Define an async function to fetch the data
    const fetchLinkedInData = async () => {
      // Only proceed with fetching if we have a LinkedIn identifier
      if (!linkedinIdentifier) {
        return;
      }
      
      try {
        setIsLoading(true);
        setError(null);
        
        // Simulate API delay
        await delay(800);
        
        // For demo, we'll return mock data regardless of the actual identifier
        setExperience(mockLinkedInExperience);
      } catch (err) {
        console.error('Error fetching LinkedIn experience:', err);
        setError('Failed to load work experience');
      } finally {
        setIsLoading(false);
      }
    };

    // Call the async function
    fetchLinkedInData();
  }, [linkedinIdentifier]); // Depend on the identifier

  return { experience, isLoading, error };
}
