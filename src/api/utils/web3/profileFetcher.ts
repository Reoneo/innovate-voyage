
import { Profile } from '@/types/profile';
import { validateInput } from '@/utils/secureStorage';
import { ensClient } from '@/utils/ens/ensClient';

/**
 * Fetches profile information using ENS client
 * @param input - An Ethereum address, ENS name, or other identifier.
 * @returns A promise that resolves to a Profile object or null if no profile is found.
 */
export async function fetchProfile(input: string): Promise<Profile | null> {
  if (!input) {
    console.warn('No input provided to fetchProfile');
    return null;
  }

  // Validate input format
  if (!validateInput.ensName(input) && !validateInput.ethereumAddress(input)) {
    console.warn('Invalid input format for profile fetch');
    return null;
  }

  try {
    let address: string | null = null;
    let identity: string = input;

    // If input is an ENS name, resolve to address
    if (validateInput.ensName(input)) {
      const addressRecord = await ensClient.getAddressRecord({ name: input });
      address = addressRecord?.value || null;
      identity = input;
    } else if (validateInput.ethereumAddress(input)) {
      // If input is an address, try reverse resolution
      const nameRecord = await ensClient.getName({ address: input as `0x${string}` });
      address = input;
      identity = nameRecord?.name || input;
    }

    if (address) {
      // Try to get additional ENS records
      const [avatar, description] = await Promise.all([
        ensClient.getTextRecord({ name: identity, key: 'avatar' }).catch(() => null),
        ensClient.getTextRecord({ name: identity, key: 'description' }).catch(() => null),
      ]);

      const profile: Profile = {
        address,
        identity,
        avatar: avatar?.value || undefined,
        description: description?.value || undefined,
        platform: 'ens',
        socialProfiles: {},
        links: {}
      };

      console.log('Profile found via ENS client');
      return profile;
    }

    console.log('No profile found');
    return null;

  } catch (error: any) {
    console.error('Error fetching profile:', error);
    throw new Error(`Failed to fetch profile: ${error.message}`);
  }
}
