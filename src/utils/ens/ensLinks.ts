
import { ensClient } from './ensClient';

export interface EnsLinks {
  socials: Record<string, string>;
  ensLinks: string[];
  description?: string;
  keywords?: string[];
}

/**
 * Get ENS links from text records
 */
export async function getEnsLinks(ensName: string, network: 'mainnet' | 'optimism' = 'mainnet'): Promise<EnsLinks> {
  const result: EnsLinks = {
    socials: {},
    ensLinks: []
  };

  try {
    if (!ensName.endsWith('.eth')) {
      return result;
    }

    // Common social media keys
    const socialKeys = [
      'com.twitter',
      'com.github', 
      'com.linkedin',
      'url',
      'email',
      'com.discord',
      'com.telegram',
      'description'
    ];

    const records = await Promise.allSettled(
      socialKeys.map(async key => {
        const record = await ensClient.getTextRecord({ name: ensName, key });
        return { key, value: record?.value };
      })
    );

    records.forEach((record, index) => {
      if (record.status === 'fulfilled' && record.value.value) {
        const key = socialKeys[index];
        const value = record.value.value;

        switch (key) {
          case 'com.twitter':
            result.socials.twitter = value;
            break;
          case 'com.github':
            result.socials.github = value;
            break;
          case 'com.linkedin':
            result.socials.linkedin = value;
            break;
          case 'url':
            result.socials.website = value;
            break;
          case 'email':
            result.socials.email = value;
            break;
          case 'com.discord':
            result.socials.discord = value;
            break;
          case 'com.telegram':
            result.socials.telegram = value;
            break;
          case 'description':
            result.description = value;
            break;
        }
      }
    });

    console.log(`Retrieved ENS links for ${ensName}:`, result);
    return result;
  } catch (error) {
    console.error(`Error fetching ENS links for ${ensName}:`, error);
    return result;
  }
}
