
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div id="bio-section" className="mb-8">
      <div className="flex items-center justify-between border-b border-gray-100 pb-2 mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Bio</h2>
        {isOwner && !isEditing && (
          <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
            <PencilLine className="h-4 w-4 mr-2" />
            Edit
          </Button>
        )}
      </div>
      
      {isEditing ? (
        <div className="space-y-4">
          <Textarea 
            value={bio} 
            onChange={(e) => setBio(e.target.value)} 
            placeholder="Write your bio here..."
            className="min-h-[120px] border-gray-300"
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
            <p className="whitespace-pre-wrap text-gray-700 leading-relaxed">{bio}</p>
          ) : isOwner ? (
            <p className="text-muted-foreground italic">
              Click the edit button to add your bio.
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default BioSection;
