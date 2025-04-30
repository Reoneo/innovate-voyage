
/**
 * Utility functions for Ethereum Follow Protocol
 */

// Helper to shorten addresses
export function shortenAddress(addr: string): string {
  if (!addr) return "";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

// Process array of users and add ENS data
export const processUsers = async (users: any[], fetchEnsData: (address: string) => Promise<any>): Promise<any[]> => {
  return Promise.all(
    users.map(async (user) => {
      const address = user.data || user.address;
      const ensData = await fetchEnsData(address);
      return {
        address,
        ensName: ensData?.ens?.name,
        avatar: ensData?.ens?.avatar
      };
    })
  );
};

// Remove duplicates from an array of EFP persons
export function removeDuplicates(persons: any[]): any[] {
  return persons.filter((friend, index, self) =>
    index === self.findIndex((f) => f.address === friend.address)
  );
}
