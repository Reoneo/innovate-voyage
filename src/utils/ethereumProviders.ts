
import { ethers } from 'ethers';

// Initialize Ethereum providers with public endpoints
export const mainnetProvider = new ethers.JsonRpcProvider("https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"); // Free tier Infura endpoint
export const optimismProvider = new ethers.JsonRpcProvider("https://optimism-mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161"); // Optimism endpoint
