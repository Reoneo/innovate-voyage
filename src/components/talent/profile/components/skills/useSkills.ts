
import { useState, useEffect } from 'react';

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
      try {
        const savedSkills = JSON.parse(localStorage.getItem(storageKey) || '[]');
        if (savedSkills.length > 0) {
          const existingSkillNames = new Set(initialSkills.map(skill => skill.name));
          const newSkills = savedSkills.filter(skill => !existingSkillNames.has(skill.name));
          setUserSkills([...initialSkills, ...newSkills]);
        }
      } catch (error) {
        console.error('Error loading skills from localStorage:', error);
      }
    }
  }, [ownerAddress, initialSkills]);

  const saveSkillsToLocalStorage = (skills: Skill[]) => {
    try {
      const storageKey = `user_skills_${ownerAddress}`;
      localStorage.setItem(storageKey, JSON.stringify(skills));
    } catch (error) {
      console.error('Error saving skills to localStorage:', error);
    }
  };

  const addSkill = (skillName: string) => {
    const newSkill = {
      name: skillName,
      proof: undefined,
      issued_by: undefined
    };
    
    setUserSkills(prevSkills => {
      const existingSkillNames = new Set(prevSkills.map(skill => skill.name));
      if (!existingSkillNames.has(skillName)) {
        const updatedSkills = [...prevSkills, newSkill];
        saveSkillsToLocalStorage(updatedSkills);
        return updatedSkills;
      }
      return prevSkills;
    });
    
    return true;
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
