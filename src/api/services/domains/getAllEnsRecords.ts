
import { ENSRecord } from '../../types/web3Types';
import { delay } from '../../jobsApi';
import { mockEnsRecords } from '../../data/mockWeb3Data';
import { generateFallbackAvatar } from '../../utils/web3/index';
import { ensClient } from '@/utils/ens/ensClient';

// Get all available ENS records (for demo purposes)
export async function getAllEnsRecords(): Promise<ENSRecord[]> {
  await delay(400);
  
  // Make sure all records have avatars
  await Promise.all(
    mockEnsRecords.map(async (record) => {
      if (!record.avatar) {
        // Try to fetch real avatar using ENS client
        try {
          const avatarRecord = await ensClient.getTextRecord({ name: record.ensName, key: 'avatar' });
          if (avatarRecord?.value) {
            record.avatar = avatarRecord.value;
          } else {
            record.avatar = generateFallbackAvatar();
          }
        } catch (error) {
          record.avatar = generateFallbackAvatar();
        }
      }
    })
  );
  
  return [...mockEnsRecords];
}
