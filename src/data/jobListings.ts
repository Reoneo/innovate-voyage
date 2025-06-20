
import { Job } from "@/types/job";

export const jobListings: Job[] = [
  {
    "job_id": "JOB-2000",
    "title": "Customer service manager",
    "type": "Full-Time",
    "salary": "£39397 per annum",
    "description": "Difficult current out politics read star seem cup cultural project pattern out the with table kind general white recent miss southern.",
    "location": "Gomezville, UK",
    "skills": ["CI/CD", "Flask", "Git", "Django"],
    "company": "Patrick Group",
    "apply_url": "https://myers.com/",
    "posted_date": "2025-02-26"
  },
  {
    "job_id": "JOB-2001",
    "title": "Ophthalmologist",
    "type": "Temporary",
    "salary": "£50152 per month",
    "description": "Candidate those wall shake how his result else accept mother value seat remember end trouble early way.",
    "location": "Cynthiaview, UK",
    "skills": ["Django", "CI/CD", "Node.js", "SQL"],
    "company": "Brown-Taylor",
    "apply_url": "http://crawford.com/",
    "posted_date": "2025-03-19"
  },
  {
    "job_id": "JOB-2002",
    "title": "Scientist, water quality",
    "type": "Full-Time",
    "salary": "£40705 per annum",
    "description": "Especially wall staff interesting not Congress center goal artist in stand professional generation process effect certainly team along including stand citizen apply about.",
    "location": "New Courtney, UK",
    "skills": ["MongoDB", "JavaScript", "Kubernetes", "React"],
    "company": "Hess, Zhang and Miller",
    "apply_url": "https://www.hale-bennett.com/",
    "posted_date": "2025-03-27"
  },
  {
    "job_id": "JOB-2003",
    "title": "Veterinary surgeon",
    "type": "Contract",
    "salary": "£37244 per annum",
    "description": "Ahead remain national marriage purpose best itself laugh clearly individual share strategy what.",
    "location": "West Adam, UK",
    "skills": ["Django", "Terraform", "React", "Node.js"],
    "company": "Price-Travis",
    "apply_url": "https://www.simmons-haley.info/",
    "posted_date": "2025-01-22"
  },
  {
    "job_id": "JOB-2004",
    "title": "Sports administrator",
    "type": "Internship",
    "salary": "£61244 per month",
    "description": "Heavy fall score become live response area far quality general hold hospital eight finally college bring save situation anything hospital camera.",
    "location": "West Ann, UK",
    "skills": ["Node.js", "Kubernetes", "MongoDB", "Git"],
    "company": "Hughes, Morgan and Williamson",
    "apply_url": "https://www.bell.net/",
    "posted_date": "2025-02-09"
  }
];

// Helper function to get a job by ID
export const getJobById = (jobId: string): Job | undefined => {
  return jobListings.find(job => job.job_id === jobId);
};

// Helper function to filter jobs by various criteria
export const filterJobs = (
  criteria: {
    type?: string;
    skills?: string[];
    location?: string;
    search?: string;
  }
): Job[] => {
  return jobListings.filter(job => {
    // Filter by job type
    if (criteria.type && job.type !== criteria.type) {
      return false;
    }
    
    // Filter by skills (if any skill matches)
    if (criteria.skills && criteria.skills.length > 0) {
      if (!criteria.skills.some(skill => job.skills.includes(skill))) {
        return false;
      }
    }
    
    // Filter by location
    if (criteria.location && !job.location.toLowerCase().includes(criteria.location.toLowerCase())) {
      return false;
    }
    
    // Filter by search term (checks title, company, and description)
    if (criteria.search) {
      const searchLower = criteria.search.toLowerCase();
      const matchesSearch = 
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower);
      
      if (!matchesSearch) {
        return false;
      }
    }
    
    return true;
  });
};
