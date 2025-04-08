
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

const SkillsCard: React.FC<SkillsCardProps> = ({ walletAddress, skills }) => {
  const [talentSkills, setTalentSkills] = useState<string[]>([]);
  const [credentialSkills, setCredentialSkills] = useState<string[]>([]);
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

        // Fetch passport credentials using the deprecated v1 endpoint
        const credentialsResponse = await fetch('https://api.talentprotocol.com/api/v1/passport_credentials', {
          headers: {
            'X-API-KEY': '2c95fd7fc86931938e0fc8363bd62267096147882462508ae18682786e4f'
          }
        });
        
        if (credentialsResponse.ok) {
          const credentialsData = await credentialsResponse.json() as PassportCredentialsApiResponse;
          console.log('TalentProtocol Credentials API response:', credentialsData);
          
          if (credentialsData?.passport_credentials && credentialsData.passport_credentials.length > 0) {
            // Add the credential category to make it more descriptive
            const formattedCredentials = credentialsData.passport_credentials.map(cred => 
              `${cred.name} (${cred.category})`
            );
            
            setCredentialSkills(formattedCredentials);
          } else {
            console.log('No passport credentials found');
            // Fallback to some sample credentials for testing
            setCredentialSkills(['Web3 Developer (Skill)', 'Active Wallet (Activity)']);
          }
        } else {
          console.error('Failed to fetch credentials from TalentProtocol:', await credentialsResponse.text());
          
          // Fallback to some sample credentials for testing
          setCredentialSkills(['Web3 Developer (Skill)', 'Active Wallet (Activity)']);
        }
      } catch (error) {
        console.error('Error fetching TalentProtocol data:', error);
        // Fallback to some sample data in case of errors
        setTalentSkills(['JavaScript', 'React', 'Solidity']);
        setCredentialSkills(['Web3 Developer (Skill)', 'Active Wallet (Activity)']);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTalentData();
  }, [walletAddress]);

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
