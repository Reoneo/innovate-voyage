
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
}

// Mock data simulating SpruceID witness activity
// In a real implementation, this would fetch from the actual SpruceID witness API
const mockSpruceIdActivity: SpruceIdActivity[] = [
  {
    credential_id: 'urn:uuid:spruce-1',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:alice.example.com',
    credential_type: 'DnsCredential',
    issued_at: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
    verification_status: 'verified',
    evidence_url: 'https://alice.example.com',
    platform: 'DNS'
  },
  {
    credential_id: 'urn:uuid:spruce-2',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0x742d35Cc6634C0532925a3b8D5C8C12fC47AfDd',
    credential_type: 'TwitterCredential',
    issued_at: new Date(Date.now() - 7200000).toISOString(), // 2 hours ago
    verification_status: 'verified',
    platform: 'Twitter',
    handle: 'cryptodev_eth'
  },
  {
    credential_id: 'urn:uuid:spruce-3',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:bob.dev',
    credential_type: 'GitHubCredential',
    issued_at: new Date(Date.now() - 10800000).toISOString(), // 3 hours ago
    verification_status: 'verified',
    platform: 'GitHub',
    handle: 'bobthebuilder'
  },
  {
    credential_id: 'urn:uuid:spruce-4',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:pkh:eip155:1:0x8ba1f109551bD432803012645Hac136c55b35d',
    credential_type: 'TwoKeyLinkingCredential',
    issued_at: new Date(Date.now() - 14400000).toISOString(), // 4 hours ago
    verification_status: 'verified',
    platform: 'Cross-Chain'
  },
  {
    credential_id: 'urn:uuid:spruce-5',
    issuer: 'did:web:witness.sprucekit.dev',
    subject: 'did:web:charlie.crypto',
    credential_type: 'BasicProfileCredential',
    issued_at: new Date(Date.now() - 18000000).toISOString(), // 5 hours ago
    verification_status: 'verified',
    platform: 'Profile'
  }
];

export const fetchRecentSpruceIdUsers = async (limit: number = 20): Promise<SpruceIdUser[]> => {
  console.log('Fetching recent SpruceID users, limit:', limit);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Transform activity data to user format
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
      platform: activity.platform
    };
  });
  
  return users;
};
