
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
}

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
          contractAddress: '0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85'
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
          contractAddress: '0x8a90cab2b38dba80c64b7734e58ee1db38b8992e'
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
          contractAddress: '0x22c1f6050e56d2876009903609a2cc3fef83b415'
        },
        {
          id: 'poap-2',
          name: 'ETHDenver 2023',
          description: 'Attended ETHDenver 2023 as a builder',
          imageUrl: 'https://assets.poap.xyz/ethdenver-2023-attendee-2023-logo-1676465136279.png',
          collectionName: 'POAPs',
          network: 'ethereum',
          tokenId: '6129841',
          contractAddress: '0x22c1f6050e56d2876009903609a2cc3fef83b415'
        }
      ]
    },
    {
      name: '3DNS Powered Domains',
      type: '3dns',
      nfts: [
        {
          id: '3dns-1',
          name: 'metaverse.meta',
          description: '3DNS Domain - your gateway to the 3D web',
          imageUrl: 'https://docs.my.box/~gitbook/image?url=https%3A%2F%2F1581571575-files.gitbook.io%2F%7E%2Ffiles%2Fv0%2Fb%2Fgitbook-x-prod.appspot.com%2Fo%2Fspaces%252FLNPySatzgHa3v2j4Gmqn%252Fuploads%252F4HNwIbiFFE6Sd7H41SIL%252Fhex_black.png%3Falt%3Dmedia%26token%3D518e3a0f-2c02-484c-ac5b-23b7329f1176&width=376&dpr=2&quality=100&sign=c393b902&sv=2',
          collectionName: '3DNS Powered Domains',
          network: 'ethereum',
          tokenId: '12345',
          contractAddress: '0x3bbb61a8db913830c8734ea0c07bc11cd193d07a',
          externalUrl: 'https://my.box/?ref=aqdql6',
          isCustom: true
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
          externalUrl: 'https://www.ethfollow.xyz/'
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
          externalUrl: 'https://www.ethfollow.xyz/'
        }
      ]
    }
  ];

  // Return the mock data
  return mockNfts;
};
