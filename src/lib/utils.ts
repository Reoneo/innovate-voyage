
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
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
