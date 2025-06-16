
import { Job } from "@/types/job";

// Get current date and create dates for the last 3 days
const today = new Date();
const yesterday = new Date(today);
yesterday.setDate(yesterday.getDate() - 1);
const twoDaysAgo = new Date(today);
twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);
const threeDaysAgo = new Date(today);
threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

export const jobListings: Job[] = [
  {
    "job_id": "JOB-2000",
    "title": "Full Stack Developer",
    "type": "Full-Time",
    "salary": "£65000 per annum",
    "description": "We are looking for a Full Stack Developer to join our growing technology team. You will work on cutting-edge web applications using modern technologies.",
    "location": "London, UK",
    "skills": ["React", "Node.js", "TypeScript", "MongoDB"],
    "company": "TechCorp Ltd",
    "apply_url": "https://techcorp.com/careers",
    "posted_date": yesterday.toISOString().split('T')[0]
  },
  {
    "job_id": "JOB-2001",
    "title": "Frontend Developer",
    "type": "Part-Time",
    "salary": "£45000 per annum",
    "description": "Join our design team to create beautiful and responsive user interfaces. Experience with React and modern CSS frameworks required.",
    "location": "Manchester, UK",
    "skills": ["React", "CSS", "JavaScript", "Figma"],
    "company": "Design Studio UK",
    "apply_url": "https://designstudio.co.uk/jobs",
    "posted_date": twoDaysAgo.toISOString().split('T')[0]
  },
  {
    "job_id": "JOB-2002",
    "title": "Senior Software Engineer",
    "type": "Full-Time",
    "salary": "£80000 per annum",
    "description": "Lead our engineering team in building scalable software solutions. Strong background in backend technologies and system architecture required.",
    "location": "Birmingham, UK",
    "skills": ["Python", "Docker", "AWS", "PostgreSQL"],
    "company": "CloudTech Solutions",
    "apply_url": "https://cloudtech.co.uk/careers",
    "posted_date": yesterday.toISOString().split('T')[0]
  },
  {
    "job_id": "JOB-2003",
    "title": "DevOps Engineer",
    "type": "Contract",
    "salary": "£600 per day",
    "description": "Help us streamline our deployment processes and manage our cloud infrastructure. Experience with Kubernetes and CI/CD pipelines essential.",
    "location": "Remote, UK",
    "skills": ["Kubernetes", "Jenkins", "Terraform", "Linux"],
    "company": "Infrastructure Pro",
    "apply_url": "https://infrapro.com/contract-roles",
    "posted_date": today.toISOString().split('T')[0]
  },
  {
    "job_id": "JOB-2004",
    "title": "Mobile App Developer",
    "type": "Full-Time",
    "salary": "£55000 per annum",
    "description": "Develop cross-platform mobile applications using React Native. Work closely with our product team to deliver exceptional user experiences.",
    "location": "Edinburgh, UK",
    "skills": ["React Native", "iOS", "Android", "Redux"],
    "company": "Mobile Innovations Ltd",
    "apply_url": "https://mobileinnovations.co.uk/jobs",
    "posted_date": threeDaysAgo.toISOString().split('T')[0]
  },
  {
    "job_id": "JOB-2005",
    "title": "UI/UX Designer",
    "type": "Part-Time",
    "salary": "£35000 per annum",
    "description": "Create intuitive and engaging user experiences for our technology products. Proficiency in design tools and user research methods required.",
    "location": "Bristol, UK",
    "skills": ["Figma", "Sketch", "Adobe XD", "User Research"],
    "company": "Creative Tech Agency",
    "apply_url": "https://creativetech.agency/careers",
    "posted_date": yesterday.toISOString().split('T')[0]
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
