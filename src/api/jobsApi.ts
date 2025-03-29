
import { Job } from "@/types/job";
import { jobListings, getJobById, filterJobs } from "@/data/jobListings";

// Simulate API latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const jobsApi = {
  // Get all jobs
  getAllJobs: async (): Promise<Job[]> => {
    await delay(500); // Simulate network delay
    return [...jobListings];
  },
  
  // Get job by ID
  getJobById: async (jobId: string): Promise<Job | null> => {
    await delay(300);
    const job = getJobById(jobId);
    return job || null;
  },
  
  // Search and filter jobs
  searchJobs: async (params: {
    type?: string;
    skills?: string[];
    location?: string;
    search?: string;
  }): Promise<Job[]> => {
    await delay(700);
    return filterJobs(params);
  },
  
  // Get all unique skills from job listings
  getUniqueSkills: async (): Promise<string[]> => {
    await delay(200);
    const skillsSet = new Set<string>();
    
    jobListings.forEach(job => {
      job.skills.forEach(skill => skillsSet.add(skill));
    });
    
    return [...skillsSet].sort();
  },
  
  // Get all unique job types
  getJobTypes: async (): Promise<string[]> => {
    await delay(200);
    const typesSet = new Set<string>();
    
    jobListings.forEach(job => {
      typesSet.add(job.type);
    });
    
    return [...typesSet].sort();
  },
  
  // Get all unique locations
  getLocations: async (): Promise<string[]> => {
    await delay(200);
    const locationsSet = new Set<string>();
    
    jobListings.forEach(job => {
      locationsSet.add(job.location);
    });
    
    return [...locationsSet].sort();
  }
};
