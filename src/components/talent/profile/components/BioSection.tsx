import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilLine, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface BioSectionProps {
  ownerAddress: string;
  initialBio?: string;
}

const BioSection: React.FC<BioSectionProps> = ({ ownerAddress, initialBio = '' }) => {
  const [bio, setBio] = useState(initialBio);
  const [isEditing, setIsEditing] = useState(false);
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

    const savedBio = localStorage.getItem(`user_bio_${ownerAddress}`);
    if (savedBio) {
      setBio(savedBio);
    } else if (initialBio) {
      setBio(initialBio);
    }
  }, [ownerAddress, initialBio]);

  const handleSave = () => {
    localStorage.setItem(`user_bio_${ownerAddress}`, bio);
    setIsEditing(false);
    
    toast({
      title: "Bio Saved",
      description: "Your bio has been updated successfully."
    });
  };

  if (!bio && !isEditing && !isOwner) {
    return null;
  }

  return (
    <Card id="bio-section">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Bio</CardTitle>
            <CardDescription>Tell others about yourself</CardDescription>
          </div>
          {isOwner && !isEditing && (
            <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
              <PencilLine className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <div className="space-y-4">
            <Textarea 
              value={bio} 
              onChange={(e) => setBio(e.target.value)} 
              placeholder="Write something about yourself..."
              className="min-h-[120px]"
            />
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setIsEditing(false)}>Cancel</Button>
              <Button onClick={handleSave}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <div className="prose max-w-none">
            {bio ? (
              <p className="whitespace-pre-wrap">{bio}</p>
            ) : isOwner ? (
              <p className="text-muted-foreground italic">
                Add information about yourself to help others learn more about your experience and background.
                Click the edit button to get started.
              </p>
            ) : null}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BioSection;
