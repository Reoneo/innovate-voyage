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
  
  // Search and filter jobs - Fixed to return more comprehensive results
  searchJobs: async (params: {
    type?: string;
    skills?: string[];
    location?: string;
    search?: string;
    postedWithinDays?: number;
  }): Promise<Job[]> => {
    await delay(700);
    const allJobs = await jobsApi.getAllJobs();
    
    return allJobs.filter(job => {
      // More flexible filtering for job type
      if (params.type) {
        const typeFilter = params.type.toLowerCase();
        const jobType = job.type.toLowerCase();
        const jobLocation = job.location.toLowerCase();
        
        // Check if type matches job type or location contains the type
        const typeMatch = jobType.includes(typeFilter) ||
                         jobLocation.includes(typeFilter) ||
                         (typeFilter === 'remote' && jobLocation.includes('remote')) ||
                         (typeFilter === 'full-time' && (jobType.includes('full') || jobType.includes('time'))) ||
                         (typeFilter === 'part-time' && jobType.includes('part')) ||
                         (typeFilter === 'contract' && jobType.includes('contract')) ||
                         (typeFilter === 'internship' && jobType.includes('intern'));
        
        if (!typeMatch) return false;
      }
      
      // More flexible skill matching
      if (params.skills && params.skills.length > 0) {
        const hasSkillMatch = params.skills.some(skill => {
          const skillLower = skill.toLowerCase();
          return job.skills.some(jobSkill => jobSkill.toLowerCase().includes(skillLower)) ||
                 job.title.toLowerCase().includes(skillLower) ||
                 job.description.toLowerCase().includes(skillLower) ||
                 job.company.toLowerCase().includes(skillLower);
        });
        
        if (!hasSkillMatch) return false;
      }
      
      // More flexible location matching
      if (params.location) {
        const locationFilter = params.location.toLowerCase();
        const jobLocation = job.location.toLowerCase();
        
        // Handle common location variations
        const locationMatch = jobLocation.includes(locationFilter) ||
                             (locationFilter.includes('uk') && (jobLocation.includes('united kingdom') || jobLocation.includes('london') || jobLocation.includes('england'))) ||
                             (locationFilter.includes('usa') && (jobLocation.includes('united states') || jobLocation.includes('america'))) ||
                             (locationFilter.includes('remote') && jobLocation.includes('remote'));
        
        if (!locationMatch) return false;
      }
      
      // Enhanced search term matching
      if (params.search) {
        const searchLower = params.search.toLowerCase();
        const searchableText = [
          job.title,
          job.company,
          job.description,
          job.location,
          ...job.skills
        ].join(' ').toLowerCase();
        
        if (!searchableText.includes(searchLower)) return false;
      }

      // Date filtering remains the same
      if (params.postedWithinDays) {
        const NdaysAgo = new Date();
        NdaysAgo.setDate(NdaysAgo.getDate() - params.postedWithinDays);
        NdaysAgo.setHours(0, 0, 0, 0); 
        
        const jobDate = new Date(job.posted_date);
        jobDate.setHours(0, 0, 0, 0);

        if (jobDate < NdaysAgo) return false;
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
      // Add additional derived types for better filtering
      if (job.location.toLowerCase().includes('remote')) {
        typesSet.add('Remote');
      }
    });
    
    return [...typesSet].sort();
  },
  
  // Get all unique locations - Enhanced to return more comprehensive list
  getLocations: async (): Promise<string[]> => {
    await delay(200);
    const jobs = await jobsApi.getAllJobs();
    const locationsSet = new Set<string>();
    
    jobs.forEach(job => {
      // Add the original location
      locationsSet.add(job.location);
      
      // Extract and add country/region information
      const location = job.location.toLowerCase();
      if (location.includes('remote')) locationsSet.add('Remote');
      if (location.includes('uk') || location.includes('united kingdom') || location.includes('london')) locationsSet.add('United Kingdom');
      if (location.includes('usa') || location.includes('united states') || location.includes('america')) locationsSet.add('United States');
      if (location.includes('canada')) locationsSet.add('Canada');
      if (location.includes('germany')) locationsSet.add('Germany');
      if (location.includes('france')) locationsSet.add('France');
      if (location.includes('netherlands')) locationsSet.add('Netherlands');
      if (location.includes('singapore')) locationsSet.add('Singapore');
      if (location.includes('australia')) locationsSet.add('Australia');
    });
    
    return [...locationsSet].sort();
  }
};
