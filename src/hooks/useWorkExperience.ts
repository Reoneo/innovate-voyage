
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { secureStorage, validateInput } from '@/utils/securityUtils';

export interface WorkExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

export function useWorkExperience(ownerAddress?: string) {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const checkOwnership = async () => {
      if (!ownerAddress) return;
      const connectedAddress = await secureStorage.getItem('connectedWalletAddress');
      if (connectedAddress && connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
        setIsOwner(true);
      } else {
        setIsOwner(false);
      }
    };
    checkOwnership();
  }, [ownerAddress]);

  useEffect(() => {
    const loadExperiences = async () => {
      if (!ownerAddress) return;
      try {
        const savedData = await secureStorage.getItem(`user_experiences_${ownerAddress}`);
        if (savedData) {
          const savedExperiences = JSON.parse(savedData);
          if (Array.isArray(savedExperiences) && savedExperiences.length > 0) {
            setExperiences(savedExperiences);
          }
        }
      } catch (error) {
        console.error('Error loading experiences from secureStorage:', error);
      }
    };
    
    loadExperiences();
  }, [ownerAddress]);

  const handleAddNew = () => {
    setCurrentExperience({
      id: Date.now().toString(),
      role: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    });
    setIsEditing(true);
  };

  const handleEdit = (experience: WorkExperience) => {
    setCurrentExperience(experience);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setCurrentExperience(null);
    setIsEditing(false);
  };
  
  const handleDelete = async (id: string) => {
    if (!ownerAddress) return;
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    await secureStorage.setItem(`user_experiences_${ownerAddress}`, JSON.stringify(updatedExperiences));
    toast({
      title: "Experience Removed",
      description: "The work experience has been removed from your profile."
    });
  };

  const handleSave = async () => {
    if (!currentExperience || !ownerAddress) return;

    const sanitizedExperience = {
      ...currentExperience,
      role: validateInput.sanitizeString(currentExperience.role),
      company: validateInput.sanitizeString(currentExperience.company),
      description: validateInput.sanitizeString(currentExperience.description),
    };
    
    let updatedExperiences: WorkExperience[];
    
    const experienceExists = experiences.some(exp => exp.id === sanitizedExperience.id);

    if (experienceExists) {
      updatedExperiences = experiences.map(exp => 
        exp.id === sanitizedExperience.id ? sanitizedExperience : exp
      );
    } else {
      updatedExperiences = [...experiences, sanitizedExperience];
    }
    
    setExperiences(updatedExperiences);
    
    await secureStorage.setItem(`user_experiences_${ownerAddress}`, JSON.stringify(updatedExperiences));
    
    setCurrentExperience(null);
    setIsEditing(false);
    
    toast({
      title: "Experience Saved",
      description: "Your work experience has been updated successfully."
    });
  };

  return {
    experiences,
    isEditing,
    currentExperience,
    isOwner,
    handleAddNew,
    handleEdit,
    handleDelete,
    handleSave,
    handleCancel,
    setCurrentExperience
  };
}
