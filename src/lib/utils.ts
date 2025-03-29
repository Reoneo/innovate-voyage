import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type for skill with proof
export interface Skill {
  name: string;
  proof: string;
}

// Type for blockchain passport
export interface BlockchainPassport {
  passport_id: string; // ENS or address
  owner_address: string;
  avatar_url: string;
  name: string;
  issued: string;
  skills: Skill[];
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
    email?: string;
  };
  additionalEnsDomains?: string[]; // Add this property
}

// Type for job posting
export interface JobPosting {
  id: string;
  title: string;
  company: string;
  description: string;
  location: string;
  remote: boolean;
  salary: string;
  skills: string[];
  posted: string;
  deadline: string;
  category: string;
  logo: string;
}

// Helper function for truncating addresses
export function truncateAddress(address: string): string {
  if (!address) return '';
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

// Function to calculate a human score based on blockchain activity
export function calculateHumanScore(passport: BlockchainPassport): { score: number, category: string } {
  // Base score for having an ENS name
  let score = passport.passport_id.includes('.eth') ? 40 : 20;
  
  // Add points for each skill
  score += Math.min(passport.skills?.length * 5, 30);
  
  // Add points for social accounts
  const socialCount = Object.values(passport.socials || {}).filter(Boolean).length;
  score += socialCount * 8;
  
  // Add points for having additional ENS domains
  if (passport.additionalEnsDomains?.length) {
    score += Math.min(passport.additionalEnsDomains.length * 3, 15);
  }
  
  // Cap the score at 100
  score = Math.min(score, 100);
  
  // Determine category based on score
  let category = 'Limited Activity';
  if (score >= 80) category = 'Trusted Identity';
  else if (score >= 60) category = 'Established Profile';
  else if (score >= 40) category = 'Active Account';
  else if (score >= 20) category = 'Basic Identity';
  
  return { score, category };
}

// Helper function to get color class based on score
export function getScoreColorClass(score: number): string {
  if (score >= 80) return 'text-purple-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 40) return 'text-emerald-500';
  if (score >= 20) return 'text-amber-500';
  return 'text-gray-500';
}
