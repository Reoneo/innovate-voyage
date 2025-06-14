
import { useState, useEffect } from 'react';
import { secureStorage, validateInput } from '@/utils/securityUtils';

interface Skill {
  name: string;
  proof?: string;
  issued_by?: string;
}

export function useSkills(initialSkills: Skill[], ownerAddress?: string) {
  const [userSkills, setUserSkills] = useState<Skill[]>(initialSkills);
  const [isOwner, setIsOwner] = useState(false);
  
  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    if (ownerAddress) {
      const storageKey = `user_skills_${ownerAddress}`;
      const loadSkills = async () => {
        try {
          const savedSkillsData = await secureStorage.getItem(storageKey);
          if (savedSkillsData) {
            const savedSkills = JSON.parse(savedSkillsData);
            if (savedSkills.length > 0) {
              const existingSkillNames = new Set(initialSkills.map(skill => skill.name));
              const newSkills = savedSkills.filter((skill: Skill) => !existingSkillNames.has(skill.name));
              setUserSkills([...initialSkills, ...newSkills]);
            }
          }
        } catch (error) {
          console.error('Error loading skills from secureStorage:', error);
        }
      };
      loadSkills();
    }
  }, [ownerAddress, initialSkills]);

  const saveSkillsToLocalStorage = (skills: Skill[]) => {
    // Fire-and-forget async call
    (async () => {
      if (!ownerAddress) return;
      try {
        const storageKey = `user_skills_${ownerAddress}`;
        await secureStorage.setItem(storageKey, JSON.stringify(skills));
      } catch (error) {
        console.error('Error saving skills to secureStorage:', error);
      }
    })();
  };

  const addSkill = (skillName: string) => {
    const sanitizedSkillName = validateInput.sanitizeString(skillName.trim());
    if (!sanitizedSkillName) return false;

    const newSkill = {
      name: sanitizedSkillName,
      proof: undefined,
      issued_by: undefined
    };
    
    let skillAdded = false;
    setUserSkills(prevSkills => {
      const existingSkillNames = new Set(prevSkills.map(skill => skill.name.toLowerCase()));
      if (!existingSkillNames.has(sanitizedSkillName.toLowerCase())) {
        const updatedSkills = [...prevSkills, newSkill];
        saveSkillsToLocalStorage(updatedSkills);
        skillAdded = true;
        return updatedSkills;
      }
      return prevSkills;
    });
    
    return skillAdded;
  };

  const removeSkill = (skillName: string) => {
    const updatedSkills = userSkills.filter(skill => 
      skill.name !== skillName || skill.proof
    );
    
    setUserSkills(updatedSkills);
    saveSkillsToLocalStorage(updatedSkills);
    return true;
  };

  const verifiedSkills = userSkills.filter(skill => skill.proof);
  const unverifiedSkills = userSkills.filter(skill => !skill.proof);

  return {
    userSkills,
    verifiedSkills,
    unverifiedSkills,
    isOwner,
    addSkill,
    removeSkill
  };
}
