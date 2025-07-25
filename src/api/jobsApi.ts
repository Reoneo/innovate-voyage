
import { supabase } from "@/integrations/supabase/client";
import { Job } from "@/types/job";

// Simulate API latency
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Transform web3.career API response to our Job type
const transformWeb3Job = (apiJob: any): Job => {
  // Standardize date format for reliable comparisons
  const postedDate = apiJob.date 
    ? new Date(apiJob.date).toISOString().split('T')[0] 
    : new Date().toISOString().split('T')[0];

  return {
    job_id: apiJob.id?.toString() || `job-${Date.now()}`,
    title: apiJob.title || 'Untitled Position',
    type: apiJob.location?.includes('Remote') ? 'Remote' : 'Full-Time',
    salary: 'Competitive',
    description: apiJob.description || 'No description available',
    location: apiJob.location || apiJob.country || 'Remote',
    skills: apiJob.tags || [],
    company: apiJob.company || 'Unknown Company',
    apply_url: apiJob.apply_url || 'https://web3.career',
    posted_date: postedDate
  };
};

export const jobsApi = {
  // Get all jobs from web3.career API via proxy
  getAllJobs: async (): Promise<Job[]> => {
    try {
      const { data, error } = await supabase.functions.invoke('proxy-web3-career', {
        body: { path: 'v1?limit=1000' },
      });

      if (error) {
        console.error('Error fetching jobs via proxy:', error);
        throw new Error('Failed to fetch jobs from web3.career proxy');
      }

      if (!data) {
        return [];
      }
      
      // API returns array starting at index 2
      const jobs = data[2] || [];
      
      // Transform jobs. Date filtering will be handled by searchJobs or client-side as needed.
      return jobs.map(transformWeb3Job);
        
    } catch (error) {
      console.error('Error fetching jobs from web3.career:', error);
      // Return empty array on error
      return [];
    }
  },
  
  // Get job by ID
  getJobById: async (jobId: string): Promise<Job | null> => {
    await delay(300);
    const jobs = await jobsApi.getAllJobs();
    const job = jobs.find(job => job.job_id === jobId);
    return job || null;
  },
  
  // Search and filter jobs
  searchJobs: async (params: {
    type?: string;
    skills?: string[];
    location?: string;
    search?: string;
    postedWithinDays?: number; // New parameter for date filtering
  }): Promise<Job[]> => {
    await delay(700);
    const allJobs = await jobsApi.getAllJobs(); // Fetches all (transformed) jobs
    
    return allJobs.filter(job => {
      // Filter by job type
      if (params.type && !job.type.toLowerCase().includes(params.type.toLowerCase()) && 
          !job.location.toLowerCase().includes(params.type.toLowerCase())) { // Assuming type can also be in location for some reason as per original
        return false;
      }
      
      // Filter by skills (if any skill matches title, description, or job.skills)
      if (params.skills && params.skills.length > 0) {
        if (!params.skills.some(skill => 
          job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skill.toLowerCase())) ||
          job.title.toLowerCase().includes(skill.toLowerCase()) ||
          job.description.toLowerCase().includes(skill.toLowerCase())
        )) {
          return false;
        }
      }
      
      // Filter by location
      if (params.location && !job.location.toLowerCase().includes(params.location.toLowerCase())) {
        return false;
      }
      
      // Filter by search term (checks title, company, and description)
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        const matchesSearch = 
          job.title.toLowerCase().includes(searchLower) ||
          job.company.toLowerCase().includes(searchLower) ||
          job.description.toLowerCase().includes(searchLower);
        
        if (!matchesSearch) {
          return false;
        }
      }

      // Filter by posted date
      if (params.postedWithinDays) {
        const NdaysAgo = new Date();
        NdaysAgo.setDate(NdaysAgo.getDate() - params.postedWithinDays);
        // Normalize NdaysAgo to the start of the day for consistent comparison
        NdaysAgo.setHours(0, 0, 0, 0); 
        
        const jobDate = new Date(job.posted_date);
        // Normalize jobDate to the start of the day
        jobDate.setHours(0, 0, 0, 0);

        if (jobDate < NdaysAgo) {
          return false;
        }
      }
      
      return true;
    });
  },
  
  // Get all unique skills from job listings
  getUniqueSkills: async (): Promise<string[]> => {
    await delay(200);
    const jobs = await jobsApi.getAllJobs();
    const skillsSet = new Set<string>();
    
    jobs.forEach(job => {
      job.skills.forEach(skill => skillsSet.add(skill));
    });
    
    return [...skillsSet].sort();
  },
  
  // Get all unique job types
  getJobTypes: async (): Promise<string[]> => {
    await delay(200);
    const jobs = await jobsApi.getAllJobs();
    const typesSet = new Set<string>();
    
    jobs.forEach(job => {
      typesSet.add(job.type);
    });
    
    return [...typesSet].sort();
  },
  
  // Get all unique locations
  getLocations: async (): Promise<string[]> => {
    await delay(200);
    const jobs = await jobsApi.getAllJobs();
    const locationsSet = new Set<string>();
    
    jobs.forEach(job => {
      locationsSet.add(job.location);
    });
    
    return [...locationsSet].sort();
  }
};

