
// Service for fetching SpruceID Rebase witness data
export interface SpruceIdUser {
  id: string;
  did: string;
  domain?: string;
  credentialType: string;
  issuanceDate: string;
  verificationMethod: string;
  address?: string;
  handle?: string;
  platform?: string;
  ensName?: string;
}

export interface SpruceIdActivity {
  credential_id: string;
  issuer: string;
  subject: string;
  credential_type: string;
  issued_at: string;
  verification_status: 'verified' | 'pending' | 'expired';
  evidence_url?: string;
  platform?: string;
  handle?: string;
  ens_name?: string;
}

// Mock data simulating SpruceID witness activity with real ENS names and addresses
// In a real implementation, this would fetch from the actual SpruceID witness API
const mockSpruceIdActivity: SpruceIdActivity[] = [
  {
    credential_id: 'urn:uuid:spruce-1',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:vitalik.eth',
    credential_type: 'DnsCredential',
    issued_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    verification_status: 'verified',
    evidence_url: 'https://vitalik.eth',
    platform: 'DNS',
    ens_name: 'vitalik.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-2',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
    credential_type: 'TwitterCredential',
    issued_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    verification_status: 'verified',
    platform: 'Twitter',
    handle: 'vitalikbuterin',
    ens_name: 'vitalik.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-3',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:brantlymillegan.eth',
    credential_type: 'GitHubCredential',
    issued_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    verification_status: 'verified',
    platform: 'GitHub',
    handle: 'brantlymillegan',
    ens_name: 'brantlymillegan.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-4',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0x225f137127d9067788314bc7fcc1f36746a3c3B5',
    credential_type: 'TwoKeyLinkingCredential',
    issued_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    verification_status: 'verified',
    platform: 'Cross-Chain',
    ens_name: 'luc.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-5',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:nick.eth',
    credential_type: 'BasicProfileCredential',
    issued_at: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    verification_status: 'verified',
    platform: 'Profile',
    ens_name: 'nick.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-6',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0x983110309620D911731Ac0932219af06091b6744',
    credential_type: 'GitHubCredential',
    issued_at: new Date(Date.now() - 21600000).toISOString(), // 6 hours ago
    verification_status: 'verified',
    platform: 'GitHub',
    handle: 'jefflau',
    ens_name: 'jefflau.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-7',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:matoken.eth',
    credential_type: 'DnsCredential',
    issued_at: new Date(Date.now() - 25200000).toISOString(), // 7 hours ago
    verification_status: 'verified',
    evidence_url: 'https://matoken.eth',
    platform: 'DNS',
    ens_name: 'matoken.eth'
  },
  {
    credential_id: 'urn:uuid:spruce-8',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0xb1AdceddB2941033a090dD166a462fe1c2029484',
    credential_type: 'TwitterCredential',
    issued_at: new Date(Date.now() - 28800000).toISOString(), // 8 hours ago
    verification_status: 'verified',
    platform: 'Twitter',
    handle: 'austingriffith',
    ens_name: 'austingriffith.eth'
  }
];

export const fetchRecentSpruceIdUsers = async (limit: number = 20): Promise<SpruceIdUser[]> => {
  console.log('Fetching recent SpruceID users with ENS data, limit:', limit);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Transform activity data to user format with ENS names
  const users: SpruceIdUser[] = mockSpruceIdActivity.slice(0, limit).map((activity, index) => {
    const isEthereumDid = activity.subject.includes('eip155');
    const isDomainDid = activity.subject.includes('did:web:') && !activity.subject.includes('eip155');
    
    return {
      id: activity.credential_id,
      did: activity.subject,
      domain: isDomainDid ? activity.subject.replace('did:web:', '') : undefined,
      credentialType: activity.credential_type,
      issuanceDate: activity.issued_at,
      verificationMethod: activity.issuer,
      address: isEthereumDid ? activity.subject.split(':').pop() : undefined,
      handle: activity.handle,
      platform: activity.platform,
      ensName: activity.ens_name
    };
  });
  
  return users;
};
