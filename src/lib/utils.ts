import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Validates if a string is a valid Ethereum address
 * @param address The string to check
 * @returns boolean indicating if the address is valid
 */
export function isValidEthereumAddress(address: string): boolean {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

/**
 * Checks if a string is a valid ENS name
 * @param name The string to check
 * @returns boolean indicating if the name is a valid ENS name
 */
export function isValidEnsName(name: string): boolean {
  return /^[a-zA-Z0-9-]+\.eth$/.test(name);
}

/**
 * Truncates an Ethereum address to show first 5 and last 5 characters
 * @param address The full Ethereum address
 * @returns Truncated address with ellipsis in the middle
 */
export function truncateAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 5)}...${address.slice(-5)}`;
}

/**
 * Types for blockchain passport data
 */
export interface BlockchainPassport {
  passport_id: string;
  owner_address: string;
  avatar_url: string;
  name: string;
  issued: string;
  socials?: {
    github?: string;
    discord?: string;
    telegram?: string;
    twitter?: string;
    linkedin?: string;
    website?: string;
    email?: string;
  };
  skills?: PassportSkill[];
}

export interface PassportSkill {
  name: string;
  proof?: string;
  issued_by?: string;
  level?: number;
}

/**
 * Calculates a human reliability score based on blockchain passport data
 * @param passport Blockchain passport data object
 * @returns A score between 0-100 and category label
 */
export function calculateHumanScore(passport: BlockchainPassport): { score: number; category: string } {
  if (!passport) return { score: 0, category: 'Unverified' };
  
  let scoreTotal = 0;
  let factors = 0;
  
  // Base points for having a passport
  scoreTotal += 20;
  factors += 1;
  
  // Points for skills (up to 40 points)
  if (passport.skills && passport.skills.length > 0) {
    // More skills = higher score, max 20 points for 10+ skills
    const skillsCount = Math.min(passport.skills.length, 10);
    scoreTotal += skillsCount * 2;
    
    // Verified skills (with proof) worth more
    const verifiedSkills = passport.skills.filter(skill => !!skill.proof).length;
    scoreTotal += verifiedSkills * 2;
    
    factors += 2;
  }
  
  // Points for social connections (up to 20 points)
  if (passport.socials) {
    const socialCount = Object.values(passport.socials).filter(Boolean).length;
    scoreTotal += socialCount * 5;
    factors += 1;
  }
  
  // Points for account age (assuming issued date is when account was created)
  try {
    const issuedDate = new Date(passport.issued);
    const now = new Date();
    const ageInMonths = (now.getFullYear() - issuedDate.getFullYear()) * 12 + 
                       now.getMonth() - issuedDate.getMonth();
    
    // Up to 20 points for account age (max at 24 months/2 years)
    const agePoints = Math.min(ageInMonths, 24) * (20/24);
    scoreTotal += agePoints;
    factors += 1;
  } catch (e) {
    // Invalid date, no points added
  }
  
  // Calculate final score (normalized to 0-100)
  const rawScore = factors > 0 ? scoreTotal / factors : 0;
  const finalScore = Math.min(Math.round(rawScore), 100);
  
  // Determine category based on score
  let category = 'Unverified';
  if (finalScore >= 90) category = 'Exceptional';
  else if (finalScore >= 75) category = 'Highly Reliable';
  else if (finalScore >= 60) category = 'Reliable';
  else if (finalScore >= 45) category = 'Promising';
  else if (finalScore >= 30) category = 'Developing';
  else if (finalScore > 0) category = 'Newcomer';
  
  return { 
    score: finalScore,
    category
  };
}

/**
 * Returns a color for the human score
 * @param score The calculated human score (0-100)
 * @returns Tailwind color class
 */
export function getScoreColorClass(score: number): string {
  if (score >= 90) return 'text-purple-500';
  if (score >= 75) return 'text-indigo-500';
  if (score >= 60) return 'text-blue-500';
  if (score >= 45) return 'text-emerald-500';
  if (score >= 30) return 'text-amber-500';
  return 'text-gray-500';
}
