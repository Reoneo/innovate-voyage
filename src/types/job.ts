
export interface Job {
  job_id: string;
  title: string;
  type: "Full-Time" | "Part-Time" | "Contract" | "Temporary" | "Internship" | "Remote";
  salary: string;
  description: string;
  location: string;
  skills: string[];
  company: string;
  apply_url: string;
  posted_date: string;
}
