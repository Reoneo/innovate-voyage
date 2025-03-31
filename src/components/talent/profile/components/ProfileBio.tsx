
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { PencilLine, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface ProfileBioProps {
  bio?: string;
  ownerAddress: string;
}

const ProfileBio: React.FC<ProfileBioProps> = ({ bio, ownerAddress }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bioText, setBioText] = useState(bio || '');
  const [savedBio, setSavedBio] = useState(bio || '');
  const [isOwner, setIsOwner] = useState(false);

  // Check if the current user is the profile owner
  useEffect(() => {
    const connectedAddress = localStorage.getItem('connectedWalletAddress');
    if (connectedAddress && ownerAddress) {
      setIsOwner(connectedAddress.toLowerCase() === ownerAddress.toLowerCase());
    }

    // Load saved bio from localStorage if available
    const localBio = localStorage.getItem(`user_bio_${ownerAddress}`);
    if (localBio) {
      setSavedBio(localBio);
      setBioText(localBio);
    }
  }, [ownerAddress]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setSavedBio(bioText);
    localStorage.setItem(`user_bio_${ownerAddress}`, bioText);
    setIsEditing(false);
    toast.success("Bio updated successfully");
  };

  const handleCancel = () => {
    setBioText(savedBio);
    setIsEditing(false);
  };

  // Determine what to display based on available bio information
  const displayBio = savedBio || bio || (isOwner 
    ? "Connect your wallet to edit your bio" 
    : "ENS bio unavailable. Update via ENS.domains or connect wallet to edit");

  return (
    <div className="w-full mb-4">
      {isEditing ? (
        <div className="space-y-2">
          <Textarea
            value={bioText}
            onChange={(e) => setBioText(e.target.value)}
            placeholder="Write something about yourself..."
            className="text-sm"
          />
          <div className="flex justify-end space-x-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleCancel}
              className="h-8 px-3"
            >
              <X className="h-4 w-4 mr-1" /> Cancel
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              onClick={handleSave}
              className="h-8 px-3"
            >
              <Save className="h-4 w-4 mr-1" /> Save
            </Button>
          </div>
        </div>
      ) : (
        <div className="relative">
          <h3 className="text-lg font-semibold leading-none tracking-tight mb-2">Bio</h3>
          <p className="text-sm text-muted-foreground pr-8 mb-2">
            {displayBio}
          </p>
          
          {isOwner && (
            <Button 
              variant="ghost" 
              size="sm" 
              className="absolute top-0 right-0 h-6 w-6 p-0" 
              onClick={handleEdit}
            >
              <PencilLine className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProfileBio;
