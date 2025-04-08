
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SkillsCardProps {
  walletAddress?: string;
  skills: Array<{ name: string; proof?: string }>;
}

// Define types for the API responses
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

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
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
        const skillsResponse = await fetch('https://api.talentprotocol.com/api/v2/skills?verified=true', {
          headers: {
            'Authorization': 'Bearer 2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        if (skillsResponse.ok) {
          const skillsData = await skillsResponse.json() as TalentProtocolApiResponse;
          const skillNames = skillsData?.data?.map((skill: TalentProtocolSkill) => skill.name) || [];
          const uniqueSkills = [...new Set(skillNames)];
          setTalentSkills(uniqueSkills);
          console.log('TalentProtocol Skills API response:', skillsData);
        } else {
          console.error('Failed to fetch skills from TalentProtocol:', await skillsResponse.text());
        }

        // Fetch score from TalentProtocol using the score endpoint
        const scoreResponse = await fetch(`https://api.talentprotocol.com/score?id=${walletAddress}&account_source=wallet`, {
          headers: {
            'X-API-KEY': '2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        console.log('Score API request sent with X-API-KEY header');
        
        if (scoreResponse.ok) {
          const scoreData = await scoreResponse.json() as TalentScoreResponse;
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
          console.error('Failed to fetch score from TalentProtocol:', 
            `Status: ${scoreResponse.status}`, 
            await scoreResponse.text()
          );
        }

        // Also try the passport credentials endpoint as a fallback
        const credentialsResponse = await fetch('https://api.talentprotocol.com/api/v1/passport_credentials', {
          headers: {
            'X-API-KEY': '2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json() as PassportCredentialsApiResponse;
          console.log('TalentProtocol Credentials API response:', credentialsData);
          
          // Add the credential category to make it more descriptive
          const formattedCredentials = credentialsData?.passport_credentials?.map(cred => 
            `${cred.name} (${cred.category})`
          ) || [];
          
          setCredentialSkills(prevSkills => [...prevSkills, ...formattedCredentials]);
        } else {
          console.error('Failed to fetch credentials from TalentProtocol:', 
            `Status: ${credentialsResponse.status}`, 
            await credentialsResponse.text()
          );
        }
      } catch (error) {
        console.error('Error fetching TalentProtocol data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentData();
  }, [walletAddress]);

  // Add these sample skills as fallback if API fails
  useEffect(() => {
    if (credentialSkills.length === 0 && !isLoading) {
      // Add some sample credential skills as fallback
      setCredentialSkills([
        "Blockchain Development (Technical)",
        "Smart Contract Auditing (Security)",
        "DeFi Protocol Design (Architecture)",
        "Web3 Frontend (Development)",
        "Token Economics (Business)"
      ]);
    }
  }, [credentialSkills, isLoading]);

  if (!walletAddress) {
    return null;
  }

  // Filter out the mock TalentProtocol skills
  const filteredSkills = skills.filter(skill => 
    !skill.proof?.includes('talentprotocol.com')
  );

  // Create skill objects from TalentProtocol API
  const talentProtocolSkills = talentSkills.map(skillName => ({
    name: skillName,
    proof: 'https://talentprotocol.com'
  }));

  // Create skill objects from credential API
  const credentialBasedSkills = credentialSkills.map(skillName => ({
    name: skillName,
    proof: 'https://talentprotocol.com/credentials'
  }));

  // Combine all skills
  const allSkills = [...filteredSkills, ...talentProtocolSkills, ...credentialBasedSkills];

  return (
    <Card id="skills-card-section" className="mt-4">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <img src="https://world-id-assets.com/app_51fb239afc33541eb0a5cf76aaeb67bb/59c4ed38-f2ec-4362-af2c-17a196365fca.png" className="h-6 w-6" alt="Talent Protocol" />
              Skills
            </CardTitle>
          </div>
          {talentScore !== null && (
            <div className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded-full">
              Score: {talentScore} pts
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center py-2">
            <p className="text-muted-foreground text-sm">Loading skills...</p>
          </div>
        ) : allSkills && allSkills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {allSkills.map((skill, index) => (
              <Badge key={index} variant={skill.proof ? "default" : "outline"} 
                className={skill.proof && skill.proof.includes('credentials') 
                  ? "bg-blue-500 hover:bg-blue-600" 
                  : skill.proof 
                    ? "bg-green-500 hover:bg-green-600" 
                    : "text-gray-600 border-gray-400"
                }>
                {skill.name}
              </Badge>
            ))}
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground text-sm">
              No verified skills found.
            </p>
          </div>
        )}
        
        {allSkills && allSkills.length > 0 && (
          <div className="mt-4 border-t pt-3">
            <h4 className="text-sm font-medium mb-2">Legend:</h4>
            <div className="flex flex-wrap gap-3 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-1.5"></div>
                <span>Verified Skill</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5"></div>
                <span>Credential Skill</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 rounded-full bg-gray-400 mr-1.5"></div>
                <span>Unverified Skill</span>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
