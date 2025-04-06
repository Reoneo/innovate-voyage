
import { useState, useEffect } from 'react';

const API_KEY = '2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f';
const BASE_URL = 'https://api.talentprotocol.com/api/v2';

// Define types for TalentProtocol API responses
export interface TalentSkill {
  id: string;
  name: string;
  verified: boolean;
}

export const fetchVerifiedSkills = async (): Promise<string[]> => {
  try {
    const response = await fetch(`${BASE_URL}/skills?verified=true`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch skills: ${response.status}`);
    }

    const data = await response.json();
    
    // Extract skill names from the response
    if (Array.isArray(data) && data.length > 0) {
      return data.map((skill: TalentSkill) => skill.name);
    }
    
    console.warn('No skills found or unexpected response format:', data);
    return [];
  } catch (error) {
    console.error('Error fetching verified skills:', error);
    return [];
  }
};

export const useTalentProtocolSkills = () => {
  const [skills, setSkills] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getSkills = async () => {
      try {
        setLoading(true);
        const verifiedSkills = await fetchVerifiedSkills();
        setSkills(verifiedSkills);
        setError(null);
      } catch (err) {
        console.error('Error in useTalentProtocolSkills:', err);
        setError('Failed to fetch skills');
      } finally {
        setLoading(false);
      }
    };

    getSkills();
  }, []);

  return { skills, loading, error };
};

export default {
  fetchVerifiedSkills,
  useTalentProtocolSkills
};
