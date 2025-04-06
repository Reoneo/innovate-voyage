
import React, { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { useTalentProtocolSkills } from '@/api/services/talentProtocolService';

interface SkillsCardProps {
  skillList?: string[];
  isLoading?: boolean;
}

const SkillsCard: React.FC<SkillsCardProps> = ({ 
  skillList = [], 
  isLoading = false 
}) => {
  const [skills, setSkills] = useState<string[]>(skillList || []);
  const { 
    skills: talentProtocolSkills, 
    loading: talentProtocolLoading 
  } = useTalentProtocolSkills();
  
  useEffect(() => {
    // If we have skills from props, use those; otherwise use TalentProtocol skills
    if (skillList && skillList.length > 0) {
      setSkills(skillList);
    } else if (talentProtocolSkills && talentProtocolSkills.length > 0) {
      // Ensure we're setting an array of strings
      const stringSkills = talentProtocolSkills.map(skill => 
        typeof skill === 'string' ? skill : String(skill)
      );
      setSkills(stringSkills);
    }
  }, [skillList, talentProtocolSkills]);

  const loading = isLoading || talentProtocolLoading;

  return (
    <Card className="mb-4 shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-semibold">
          <img 
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/7c844b24-d8f5-417f-accb-574c88b75e26/Logo_TalentProtocol.jpg?table=block&id=507f9f8e-04b7-478b-8a33-8900e4838847&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1743948000000&signature=gk2ASkxTsqSqmE_gIMWkAlMMZ3Fdo1YOD9Smt-okG6s&downloadName=Logo_TalentProtocol.jpg" 
            alt="Talent Protocol" 
            className="h-4 w-4 mr-2" 
          />
          Skills
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="bg-gray-100 animate-pulse w-16 h-6" />
            <Badge variant="outline" className="bg-gray-100 animate-pulse w-20 h-6" />
            <Badge variant="outline" className="bg-gray-100 animate-pulse w-24 h-6" />
          </div>
        ) : skills && skills.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {skills.map((skill, index) => (
              <Badge key={index} variant="outline" className="bg-primary/10 text-primary">
                {skill}
              </Badge>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No skills found</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SkillsCard;
