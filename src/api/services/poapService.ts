
import { POAP } from '../types/poapTypes';
import { delay } from '../jobsApi';

// Mock POAPs data - in a real app this would come from the POAP API
const mockPoaps: POAP[] = [
  {
    event: {
      id: 1,
      fancy_id: "eth-denver-2023",
      name: "ETHDenver 2023 Attendee",
      description: "This POAP was awarded to attendees of ETHDenver 2023, the world's largest web3 #BUIDLathon.",
      start_date: "2023-02-24",
      end_date: "2023-03-05",
      expiry_date: "2023-03-12",
      city: "Denver",
      country: "USA",
      event_url: "https://www.ethdenver.com",
      image_url: "https://assets.poap.xyz/ethdenver-2023-attendee-2023-logo-1677284258503.png",
      year: 2023
    },
    tokenId: "123456",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2023-03-01T12:00:00Z"
  },
  {
    event: {
      id: 2,
      fancy_id: "devcon-6-bogota",
      name: "Devcon 6 Bogotá",
      description: "Official attendee of Devcon 6 in Bogotá, Colombia.",
      start_date: "2022-10-11",
      end_date: "2022-10-14",
      expiry_date: "2022-10-21",
      city: "Bogotá",
      country: "Colombia",
      event_url: "https://devcon.org",
      image_url: "https://assets.poap.xyz/devcon-6-bogota-2022-logo-1665430036926.png",
      year: 2022
    },
    tokenId: "789012",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2022-10-12T14:30:00Z"
  },
  {
    event: {
      id: 3,
      fancy_id: "ethcc-paris-2023",
      name: "ETHCC[6] Paris",
      description: "Attended ETHCC 6 in Paris, July 2023.",
      start_date: "2023-07-17",
      end_date: "2023-07-20",
      expiry_date: "2023-07-27",
      city: "Paris",
      country: "France",
      event_url: "https://ethcc.io",
      image_url: "https://assets.poap.xyz/ethcc6-paris-2023-logo-1689589893046.png",
      year: 2023
    },
    tokenId: "345678",
    owner: "0x1234567890abcdef1234567890abcdef12345678",
    chain: "xdai",
    created: "2023-07-18T09:45:00Z"
  }
];

// Get POAPs by address
export async function getPoapsByAddress(address: string): Promise<POAP[]> {
  await delay(600); // Simulate network delay
  
  // In a real implementation, we would fetch from the POAP API
  // Example: const response = await fetch(`https://api.poap.xyz/actions/scan/${address}`);
  
  return mockPoaps.filter(poap => 
    poap.owner.toLowerCase() === address.toLowerCase()
  );
}
