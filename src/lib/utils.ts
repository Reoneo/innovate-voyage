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
export const truncateAddress = (address: string | undefined | null): string => {
  if (!address || typeof address !== 'string') return '';
  
  if (address.length < 10) return address;
  
  return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
};

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

// Add corporate theme colors
export const corporateTheme = {
  navy: {
    50: '#f0f4f8',
    100: '#d9e2ec',
    200: '#bcccdc',
    300: '#9fb3c8',
    400: '#829ab1',
    500: '#627d98',
    600: '#486581',
    700: '#334e68',
    800: '#243b53',
    900: '#102a43',
  },
  teal: {
    50: '#e6fcf5',
    100: '#c3fae8',
    200: '#96f2d7',
    300: '#63e6be',
    400: '#38d9a9',
    500: '#20c997',
    600: '#12b886',
    700: '#0ca678',
    800: '#099268',
    900: '#087f5b',
  },
  gold: {
    50: '#fff9e6',
    100: '#ffefc2',
    200: '#ffe799',
    300: '#ffdf70',
    400: '#ffd33d',
    500: '#ffc409',
    600: '#e6ac00',
    700: '#cc9900',
    800: '#b38600',
    900: '#997300',
  },
};

// Function to fix Telegram URLs properly
export function fixTelegramUrl(url: string): string {
  // Check if it's already a proper URL
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Remove any @ prefix if present
  const username = url.startsWith('@') ? url.substring(1) : url;
  
  // Return properly formatted Telegram URL
  return `https://t.me/${username}`;
}
