
import { useState, useEffect } from 'react';

interface TalentProfile {
  username: string;
  name: string;
  bio: string;
  headline: string;
  profile_picture_url: string;
  social_links: { url: string; }[];
}

interface TalentProtocolData {
  profile: TalentProfile | null;
}

const TALENT_PROTOCOL_API_KEY = "2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f";

export function useTalentProtocolData(walletAddress?: string) {
  const [data, setData] = useState<TalentProtocolData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const profileResponse = await fetch(`https://api.talentprotocol.com/api/v1/talents/${walletAddress}`, {
          headers: { 'X-API-KEY': TALENT_PROTOCOL_API_KEY, 'Content-Type': 'application/json' }
        });

        if (profileResponse.ok) {
          const profileData = await profileResponse.json();
          setData({
            profile: profileData?.talent ?? null,
          });
        } else {
          setData({ profile: null });
        }
      } catch (error) {
        console.error('Error fetching Talent Protocol data:', error);
        setData({ profile: null });
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllData();
  }, [walletAddress]);

  return { data, isLoading };
}
