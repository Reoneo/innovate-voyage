
import { SkillNFT } from '../types/web3Types';
import { mockSkillNfts } from '../data/mockWeb3Data';
import { delay } from '../jobsApi';

// Get skill NFTs by address
export async function getSkillNftsByAddress(address: string): Promise<SkillNFT[]> {
  await delay(500); // Simulate network delay
  return mockSkillNfts.filter(nft => 
    nft.owners.some(owner => owner.toLowerCase() === address.toLowerCase())
  );
}

// Get all available skill NFTs (for demo purposes)
export async function getAllSkillNfts(): Promise<SkillNFT[]> {
  await delay(400);
  return [...mockSkillNfts];
}
