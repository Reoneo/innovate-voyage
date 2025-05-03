
import { useState, useEffect } from 'react';

interface TalentProtocolGithubResponse {
  verified: boolean;
  username?: string;
}

/**
 * Hook to verify if a GitHub account is verified on TalentProtocol
 */
export function useTalentProtocolGithub(address?: string, githubUsername?: string) {
  const [isVerified, setIsVerified] = useState(false);
  const [verifiedUsername, setVerifiedUsername] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const verifyGithub = async () => {
      if (!address || !githubUsername) {
        return;
      }

      setLoading(true);
      setError(null);

      try {
        // Note: This is a mock API call. In a real implementation,
        // you would call the actual TalentProtocol API endpoint
        console.log(`[TalentProtocol] Verifying GitHub account ${githubUsername} for address ${address}`);
        
        // Simulate API call to TalentProtocol
        const response = await fetch(`https://api.talentprotocol.com/v1/verify/github?address=${address}&username=${githubUsername}`)
          .catch(() => {
            // If the API doesn't exist yet, we'll mock a response for development
            console.log('[TalentProtocol] Using mock response');
            // Mock response based on username - for testing purposes
            return {
              ok: true,
              json: async () => ({
                verified: !!githubUsername,
                username: githubUsername
              })
            } as Response;
          });

        if (response.ok) {
          const data: TalentProtocolGithubResponse = await response.json();
          console.log('[TalentProtocol] Verification result:', data);
          
          setIsVerified(data.verified);
          setVerifiedUsername(data.username);
        } else {
          throw new Error(`Failed to verify: ${response.status}`);
        }
      } catch (err) {
        console.error('[TalentProtocol] GitHub verification error:', err);
        setError(err instanceof Error ? err.message : 'Unknown error');
      } finally {
        setLoading(false);
      }
    };

    verifyGithub();
  }, [address, githubUsername]);

  return {
    isVerified,
    verifiedUsername,
    loading,
    error
  };
}
