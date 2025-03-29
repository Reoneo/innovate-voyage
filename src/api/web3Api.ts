
import { ENSRecord, SkillNFT, Web3Credentials, Web3BioProfile } from './types/web3Types';
import { 
  getRealAvatar, 
  getEnsByAddress, 
  getAddressByEns,
  getAllEnsRecords 
} from './services/ensService';
import { 
  getSkillNftsByAddress,
  getAllSkillNfts
} from './services/nftService';
import { fetchWeb3BioProfile } from './utils/web3Utils';

// Initialize the mockEnsRecords with real avatars
(async function initializeRealAvatars() {
  // This is now handled in getAllEnsRecords
})();

// Get all Web3 credentials (ENS + Skill NFTs) by address
async function getWeb3CredentialsByAddress(address: string): Promise<Web3Credentials> {
  const [ensRecord, skillNfts] = await Promise.all([
    getEnsByAddress(address),
    getSkillNftsByAddress(address)
  ]);
  
  return {
    ensRecord,
    skillNfts
  };
}

export const web3Api = {
  getRealAvatar,
  getEnsByAddress,
  getAddressByEns,
  getSkillNftsByAddress,
  getWeb3CredentialsByAddress,
  getAllEnsRecords,
  getAllSkillNfts,
  fetchWeb3BioProfile
};
