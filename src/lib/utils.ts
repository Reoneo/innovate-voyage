
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Type for skill with proof
export interface Skill {
  name: string;
  proof: string;
  issued_by?: string;
}

// Use PassportSkill as an alias for Skill to fix the import errors
export type PassportSkill = Skill;

// Type for blockchain passport
export interface BlockchainPassport {
  passport_id: string; // ENS or address
  owner_address: string;
  avatar_url: string;
  name: string;
  issued: string;
  skills: Skill[];
  bio?: string; // Adding bio property as optional
  socials: {
    twitter?: string;
    github?: string;
    linkedin?: string;
    discord?: string;
    website?: string;
    email?: string;
    facebook?: string;
    whatsapp?: string;
    messenger?: string;
    reddit?: string;
    telegram?: string;
    instagram?: string;
    youtube?: string;
    bluesky?: string;
  };
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

// Helper function to validate Ethereum addresses
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Function to calculate a human score based on blockchain activity
export function calculateHumanScore(passport: BlockchainPassport): { score: number, category: string } {
  // Return default values since we're removing this feature
  return { score: 0, category: "" };
}

// Helper function to get color class based on score
export function getScoreColorClass(score: number): string {
  return "";
}
