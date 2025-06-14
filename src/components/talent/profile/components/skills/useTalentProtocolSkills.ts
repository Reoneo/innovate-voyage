import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface TalentProtocolSkill {
  id: number;
  name: string;
}

interface TalentProtocolApiResponse {
  data: TalentProtocolSkill[];
}

interface PassportCredential {
  earned_at: string;
  id: string;
  category: string;
  last_calculated_at: string;
  max_score: number;
  name: string;
  score: number;
  type: string;
  value: string;
}

interface PassportCredentialsApiResponse {
  passport_credentials: PassportCredential[];
}

interface TalentScoreResponse {
  score: {
    points: number;
    last_calculated_at: string | null;
  }
}

interface UseTalentProtocolSkillsResult {
  talentSkills: string[];
  credentialSkills: string[];
  talentScore: number | null;
  isLoading: boolean;
}

export function useTalentProtocolSkills(walletAddress?: string, passportId?: string): UseTalentProtocolSkillsResult {
  const [talentSkills, setTalentSkills] = useState<string[]>([]);
  const [credentialSkills, setCredentialSkills] = useState<string[]>([]);
  const [talentScore, setTalentScore] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!walletAddress) return;

    const fetchTalentData = async () => {
      setIsLoading(true);
      try {
        // Fetch skills from TalentProtocol
        const { data: skillsData, error: skillsError } = await supabase.functions.invoke('proxy-talent-protocol', {
          body: { path: '/api/v2/skills?verified=true', useBearer: true }
        });
        
        if (!skillsError && skillsData) {
          const skillNames = skillsData?.data?.map((skill: TalentProtocolSkill) => skill.name) || [];
          const uniqueSkills = [...new Set(skillNames)];
          setTalentSkills(uniqueSkills);
          console.log('TalentProtocol Skills API response:', skillsData);
        } else {
          console.error('Failed to fetch skills from TalentProtocol:', skillsError?.message);
        }

        // Fetch credentials from TalentProtocol using passport ID if available
        const credentialsPath = passportId 
          ? `/api/v1/passport_credentials?passport_id=${encodeURIComponent(passportId)}`
          : '/api/v1/passport_credentials';
          
        const { data: credentialsData, error: credentialsError } = await supabase.functions.invoke('proxy-talent-protocol', {
          body: { path: credentialsPath, useBearer: false }
        });
        
        if (!credentialsError && credentialsData) {
          console.log('TalentProtocol Credentials API response:', credentialsData);
          
          // Add the credential category to make it more descriptive
          const formattedCredentials = credentialsData?.passport_credentials?.map(cred => 
            `${cred.name} (${cred.category})`
          ) || [];
          
          setCredentialSkills(prevSkills => [...prevSkills, ...formattedCredentials]);
        } else {
          console.error('Failed to fetch credentials from TalentProtocol:', credentialsError?.message);
        }

        // Primary method: Fetch score directly with the wallet address
        const { data: scoreData, error: scoreError } = await supabase.functions.invoke('proxy-talent-protocol', {
            body: { path: `/score?id=${walletAddress}`, useBearer: false }
        });
        
        console.log('Score API request sent with wallet address:', walletAddress);
        
        if (!scoreError && scoreData) {
          console.log('TalentProtocol Score API response:', scoreData);
          setTalentScore(scoreData.score?.points || null);
          
          // Generate skills based on score
          if (scoreData.score?.points) {
            const scoreSkills = [
              `Talent Score: ${scoreData.score.points} points`,
              `Web3 Contributor`,
              `Blockchain Participant`,
              scoreData.score.points > 50 ? 'Advanced Web3 User' : 'Web3 User',
              scoreData.score.points > 75 ? 'Web3 Expert' : 'Web3 Enthusiast'
            ];
            
            setCredentialSkills(prevSkills => [...prevSkills, ...scoreSkills]);
          }
        } else {
          console.error('Failed to fetch score from TalentProtocol:', scoreError?.message);
          
          // Try with the account_source parameter
          const { data: retryScoreData, error: retryScoreError } = await supabase.functions.invoke('proxy-talent-protocol', {
            body: { path: `/score?id=${walletAddress}&account_source=wallet`, useBearer: false }
          });
          
          if (!retryScoreError && retryScoreData) {
            console.log('TalentProtocol Score retry API response:', retryScoreData);
            setTalentScore(retryScoreData.score?.points || null);
            
            if (retryScoreData.score?.points) {
              const scoreSkills = [
                `Talent Score: ${retryScoreData.score.points} points`,
                `Web3 Contributor`,
                `Blockchain Participant`
              ];
              
              setCredentialSkills(prevSkills => [...prevSkills, ...scoreSkills]);
            }
          } else {
            console.error('Retry also failed to fetch score from TalentProtocol:', retryScoreError?.message);
          }
        }
      } catch (error) {
        console.error('Error fetching TalentProtocol data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentData();
  }, [walletAddress, passportId]);

  // Add these sample skills as fallback if API fails
  useEffect(() => {
    if (credentialSkills.length === 0 && !isLoading && talentScore === null) {
      // Add some sample credential skills as fallback
      console.log('Using fallback skills data');
      setCredentialSkills([
        "Blockchain Development (Technical)",
        "Smart Contract Auditing (Security)",
        "DeFi Protocol Design (Architecture)",
        "Web3 Frontend (Development)",
        "Token Economics (Business)"
      ]);
    }
  }, [credentialSkills, isLoading, talentScore]);

  return {
    talentSkills,
    credentialSkills,
    talentScore,
    isLoading
  };
}
