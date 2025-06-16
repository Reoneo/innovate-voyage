
import { EducationalCredential } from '../types';

// Mock data for demonstration - this would be replaced with actual SpruceID/DIDKit integration
const mockEducationCredentials: EducationalCredential[] = [
  {
    id: 'urn:uuid:education-1',
    type: ['VerifiableCredential', 'EducationCredential'],
    issuer: {
      name: 'MIT',
      did: 'did:web:mit.edu',
      logo: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/MIT_logo.svg'
    },
    credentialSubject: {
      degree: 'Bachelor of Science',
      institution: 'Massachusetts Institute of Technology',
      fieldOfStudy: 'Computer Science',
      completionDate: '2020-06-15T00:00:00Z',
      grade: 'Magna Cum Laude',
      skills: ['Software Engineering', 'Algorithms', 'Data Structures', 'Machine Learning']
    },
    issuanceDate: '2020-06-15T00:00:00Z',
    verified: true,
    verificationMethod: 'did:web:mit.edu#key-1'
  },
  {
    id: 'urn:uuid:education-2',
    type: ['VerifiableCredential', 'CertificationCredential'],
    issuer: {
      name: 'Ethereum Foundation',
      did: 'did:web:ethereum.org',
      logo: 'https://ethereum.org/static/6b935ac0e6194247347855dc3d328e83/6ed5f/eth-diamond-black.webp'
    },
    credentialSubject: {
      degree: 'Ethereum Developer Certification',
      institution: 'Ethereum Foundation',
      fieldOfStudy: 'Blockchain Development',
      completionDate: '2023-03-20T00:00:00Z',
      skills: ['Solidity', 'Smart Contracts', 'Web3.js', 'DeFi']
    },
    issuanceDate: '2023-03-20T00:00:00Z',
    verified: true,
    verificationMethod: 'did:web:ethereum.org#key-1'
  }
];

export const fetchEducationCredentials = async (walletAddress: string): Promise<EducationalCredential[]> => {
  console.log('Fetching education credentials for:', walletAddress);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // In a real implementation, this would:
  // 1. Resolve the wallet address to a DID
  // 2. Fetch the DID document
  // 3. Look for education credentials in the credential registry
  // 4. Verify each credential using SpruceID/DIDKit
  // 5. Return only verified, non-expired credentials
  
  // For now, return mock data for demonstration
  // Filter out some credentials based on address to show variation
  const addressHash = walletAddress.toLowerCase().charCodeAt(walletAddress.length - 1);
  const shouldShowMIT = addressHash % 3 === 0;
  const shouldShowEthereum = addressHash % 2 === 0;
  
  return mockEducationCredentials.filter(credential => {
    if (credential.issuer.name === 'MIT' && !shouldShowMIT) return false;
    if (credential.issuer.name === 'Ethereum Foundation' && !shouldShowEthereum) return false;
    return true;
  });
};
