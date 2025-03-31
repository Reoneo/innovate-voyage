
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, PencilLine, Save, Trash2, Calendar, Building, Briefcase } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';

interface WorkExperience {
  id: string;
  role: string;
  company: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface WorkExperienceSectionProps {
  ownerAddress: string;
}

const WorkExperienceSection: React.FC<WorkExperienceSectionProps> = ({ ownerAddress }) => {
  const [experiences, setExperiences] = useState<WorkExperience[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<WorkExperience | null>(null);
  const [isOwner, setIsOwner] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    
    if (connectedAddress && ownerAddress && 
        connectedAddress.toLowerCase() === ownerAddress.toLowerCase()) {
      setIsOwner(true);
    } else {
      setIsOwner(false);
    }

    try {
      const savedExperiences = JSON.parse(localStorage.getItem(`user_experiences_${ownerAddress}`) || '[]');
      if (Array.isArray(savedExperiences) && savedExperiences.length > 0) {
        setExperiences(savedExperiences);
      }
    } catch (error) {
      console.error('Error loading experiences from localStorage:', error);
    }
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

  const handleDelete = (id: string) => {
    const updatedExperiences = experiences.filter(exp => exp.id !== id);
    setExperiences(updatedExperiences);
    
    localStorage.setItem(`user_experiences_${ownerAddress}`, JSON.stringify(updatedExperiences));
    
    toast({
      title: "Experience Removed",
      description: "The work experience has been removed from your profile."
    });
  };

  const handleSave = () => {
    if (!currentExperience) return;
    
    let updatedExperiences: WorkExperience[];
    
    if (experiences.some(exp => exp.id === currentExperience.id)) {
      updatedExperiences = experiences.map(exp => 
        exp.id === currentExperience.id ? currentExperience : exp
      );
    } else {
      updatedExperiences = [...experiences, currentExperience];
    }
    
    setExperiences(updatedExperiences);
    
    localStorage.setItem(`user_experiences_${ownerAddress}`, JSON.stringify(updatedExperiences));
    
    setCurrentExperience(null);
    setIsEditing(false);
    
    toast({
      title: "Experience Saved",
      description: "Your work experience has been updated successfully."
    });
  };

  if (experiences.length === 0 && !isEditing && !isOwner) {
    return null;
  }

  const formatDisplayDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      return format(new Date(dateString), 'MMM yyyy');
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card id="work-experience-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Work Experience</CardTitle>
            <CardDescription>Your professional experience</CardDescription>
          </div>
          {isOwner && !isEditing && (
            <Button variant="outline" size="sm" onClick={handleAddNew}>
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="role">Job Title</Label>
                <div className="relative">
                  <Input
                    id="role"
                    value={currentExperience?.role || ''}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience!,
                      role: e.target.value
                    })}
                    placeholder="Software Engineer"
                    className="pl-10"
                  />
                  <Briefcase className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <div className="relative">
                  <Input
                    id="company"
                    value={currentExperience?.company || ''}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience!,
                      company: e.target.value
                    })}
                    placeholder="Acme Inc."
                    className="pl-10"
                  />
                  <Building className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <div className="relative">
                  <Input
                    id="startDate"
                    type="month"
                    value={currentExperience?.startDate || ''}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience!,
                      startDate: e.target.value
                    })}
                    className="pl-10"
                  />
                  <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <div className="relative">
                  <Input
                    id="endDate"
                    type="month"
                    value={currentExperience?.endDate || ''}
                    onChange={(e) => setCurrentExperience({
                      ...currentExperience!,
                      endDate: e.target.value
                    })}
                    className="pl-10"
                  />
                  <Calendar className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                </div>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={currentExperience?.description || ''}
                onChange={(e) => setCurrentExperience({
                  ...currentExperience!,
                  description: e.target.value
                })}
                placeholder="Describe your responsibilities and achievements..."
                className="min-h-[100px]"
              />
            </div>
            
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  setCurrentExperience(null);
                  setIsEditing(false);
                }}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            {experiences.length > 0 ? (
              <div className="space-y-6">
                {experiences.map((exp) => (
                  <div key={exp.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-lg">{exp.role}</h3>
                        <p className="text-muted-foreground">
                          {exp.company} · {formatDisplayDate(exp.startDate)} - {exp.endDate ? formatDisplayDate(exp.endDate) : 'Present'}
                        </p>
                      </div>
                      
                      {isOwner && (
                        <div className="flex space-x-1">
                          <Button variant="ghost" size="sm" onClick={() => handleEdit(exp)}>
                            <PencilLine className="h-4 w-4" />
                            <span className="sr-only">Edit</span>
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(exp.id)}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="sr-only">Delete</span>
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    {exp.description && (
                      <p className="text-sm whitespace-pre-wrap">{exp.description}</p>
                    )}
                  </div>
                ))}
              </div>
            ) : isOwner ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  Add your work experience to showcase your professional background
                </p>
                <Button onClick={handleAddNew}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Experience
                </Button>
              </div>
            ) : (
              <div className="text-center py-6">
                <p className="text-muted-foreground">
                  Connect wallet to add work experience.
                </p>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkExperienceSection;
