
import { delay } from '../jobsApi';

export interface OpenSeaNft {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  collectionName: string;
  network: string;
  tokenId: string;
  contractAddress: string;
  metadataUrl: string;
  externalUrl?: string;
  isCustom?: boolean;
  isAd?: boolean;
  owner?: string;
  chain?: string;
  bestOffer?: string;
  currentPrice?: string;
}

// Add this function to fix the dotBoxHandler import error
export const fetchDotBoxAvatar = async (identity: string): Promise<string | null> => {
  // Simple implementation for the function that's imported but not defined
  console.log(`Trying to fetch .box avatar for ${identity}`);
  // In a real implementation, this would fetch from OpenSea
  return null;
};

// Mock OpenSea API service for demo purposes
export const fetchUserNfts = async (address: string) => {
  // For demo, just delay to simulate API call
  await delay(800);

  // Example mock data grouped by collection
  const mockNfts = [
    {
      name: 'Ethereum Name Service',
      type: 'ens',
      nfts: [
        {
          id: 'ens-1',
          name: 'vitalik.eth',
          description: 'Ethereum Name Service (ENS) domain',
          imageUrl: 'https://ens.domains/assets/brand/token-icon.svg',
          collectionName: 'Ethereum Name Service',
          network: 'ethereum',
          tokenId: '42',
          contractAddress: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85',
          metadataUrl: '',
          chain: 'ethereum'
        }
      ]
    },
    {
      name: 'Doodles',
      type: 'ethereum',
      nfts: [
        {
          id: 'doodle-1',
          name: 'Doodle #1234',
          description: 'A community-driven collectibles project',
          imageUrl: 'https://i.seadn.io/gae/7B0qai02OdHA8P_EOVK672qUliyjQdQDGNrACxs7WnTgZAkJa_wWURnIFKeOh5VTf8cfTqW3wQpozGedaC9mteKphEOtztls02RlWQ?auto=format&dpr=1&w=1000',
          collectionName: 'Doodles',
          network: 'ethereum',
          tokenId: '1234',
          contractAddress: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e',
          metadataUrl: '',
          chain: 'ethereum'
        }
      ]
    },
    {
      name: 'POAPs',
      type: 'poap',
      nfts: [
        {
          id: 'poap-1',
          name: 'ETHGlobal Paris 2023',
          description: 'Attended ETHGlobal Paris 2023',
          imageUrl: 'https://assets.poap.xyz/ethglobal-paris-2023-2023-logo-1689920889401.png',
          collectionName: 'POAPs',
          network: 'ethereum',
          tokenId: '6331448',
          contractAddress: '0x22c1f6050e56d2876009903609a2cc3fef83b415',
          metadataUrl: '',
          chain: 'ethereum'
        },
        {
          id: 'poap-2',
          name: 'ETHDenver 2023',
          description: 'Attended ETHDenver 2023 as a builder',
          imageUrl: 'https://assets.poap.xyz/ethdenver-2023-attendee-2023-logo-1676465136279.png',
          collectionName: 'POAPs',
          network: 'ethereum',
          tokenId: '6129841',
          contractAddress: '0x22c1f6050e56d2876009903609a2cc3fef83b415',
          metadataUrl: '',
          chain: 'ethereum'
        }
      ]
    },
    {
      name: 'Ethereum Follow Protocol',
      type: 'ethereum',
      nfts: [
        {
          id: 'efp-1',
          name: 'Following @vitalik.eth',
          description: 'Follow relationship on Ethereum Follow Protocol',
          imageUrl: 'https://public.rootdata.com/images/b6/1704560912107.png',
          collectionName: 'Ethereum Follow Protocol',
          network: 'ethereum',
          tokenId: 'follow-1',
          contractAddress: '0x8ec3a55128f8034887e6c42d0fefbc94a0cf6d56',
          externalUrl: 'https://www.ethfollow.xyz/',
          metadataUrl: '',
          chain: 'ethereum'
        },
        {
          id: 'efp-2',
          name: 'Following @aave.eth',
          description: 'Follow relationship on Ethereum Follow Protocol',
          imageUrl: 'https://public.rootdata.com/images/b6/1704560912107.png',
          collectionName: 'Ethereum Follow Protocol',
          network: 'ethereum',
          tokenId: 'follow-2',
          contractAddress: '0x8ec3a55128f8034887e6c42d0fefbc94a0cf6d56',
          externalUrl: 'https://www.ethfollow.xyz/',
          metadataUrl: '',
          chain: 'ethereum'
        }
      ]
    },
    {
      name: 'Base Names',
      type: 'base',
      nfts: [
        {
          id: 'base-sample',
          name: 'Base Name Sample',
          description: 'Sample Base Name - A next generation L2 blockchain',
          collectionName: 'Base Names',
          imageUrl: 'https://altcoinsbox.com/wp-content/uploads/2023/02/base-logo-in-blue.png',
          externalUrl: 'https://www.base.org/names',
          network: 'base',
          tokenId: 'sample',
          contractAddress: '',
          metadataUrl: '',
          isCustom: true,
          isAd: true,
          chain: 'base'
        }
      ]
    }
  ];

  return mockNfts;
};
