
import { useToast } from '@/hooks/use-toast';
import { useState, useEffect } from 'react';

export interface LinkedInJob {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string | null;
  description: string;
  location?: string;
  skills?: string[];
  profileUrl?: string;
}

/**
 * Extract LinkedIn handle from a LinkedIn URL or username
 */
export const extractLinkedInHandle = (linkedinValue?: string): string | null => {
  if (!linkedinValue) {
    console.log('LinkedIn value is empty or undefined');
    return null;
  }
  
  console.log('Extracting LinkedIn handle from:', linkedinValue);
  
  try {
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
    
    // If it looks like a URL but doesn't match our patterns, try regex
    if (cleanValue.includes('linkedin')) {
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
 * Fetch LinkedIn work experience for a user
 * This would integrate with actual LinkedIn API or scraping service
 */
export const fetchLinkedInExperience = async (handle: string): Promise<LinkedInJob[]> => {
  console.log(`🔍 Attempting to fetch LinkedIn experience for handle: ${handle}`);
  
  try {
    // TODO: Replace with actual LinkedIn API integration
    // For now, return empty array since we're not using mock data
    console.log('⚠️ LinkedIn API integration not yet implemented');
    console.log('📝 This would normally scrape or fetch from LinkedIn API');
    
    // Simulate network delay for realistic UX
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Return empty array - no mock data when we have real handles
    return [];
    
  } catch (error) {
    console.error(`❌ Error fetching LinkedIn experience for ${handle}:`, error);
    throw new Error('Failed to fetch LinkedIn profile data');
  }
};

/**
 * Hook to fetch LinkedIn work experience for a user
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
      
      console.log(`🚀 Starting LinkedIn profile fetch for: ${linkedinHandle}`);
      setIsLoading(true);
      setError(null);
      
      try {
        const jobs = await fetchLinkedInExperience(linkedinHandle);
        console.log('LinkedIn experience fetch completed:', jobs);
        setExperience(jobs);
        
        if (jobs.length === 0) {
          console.log('ℹ️ No LinkedIn experience data available - API integration needed');
        }
      } catch (err) {
        console.error('Error during LinkedIn data fetch:', err);
        const errorMessage = 'LinkedIn API integration required for live data';
        setError(errorMessage);
        setExperience([]);
        
        toast({
          title: "LinkedIn Integration Needed",
          description: "Connect to LinkedIn API to fetch real work experience data",
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
