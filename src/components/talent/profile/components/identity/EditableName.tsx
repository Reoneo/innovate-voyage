
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilLine, Check, X } from 'lucide-react';
import { toast } from 'sonner';

interface EditableNameProps {
  ownerAddress: string;
  isOwner: boolean;
}

const EditableName: React.FC<EditableNameProps> = ({ 
  ownerAddress,
  isOwner
}) => {
  const [customName, setCustomName] = useState<string>('');
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState('');

  useEffect(() => {
    const savedName = localStorage.getItem(`user_name_${ownerAddress}`);
    if (savedName) {
      setCustomName(savedName);
    }
  }, [ownerAddress]);

  const handleEdit = () => {
    setTempName(customName);
    setIsEditing(true);
  };

  const handleSave = () => {
    setCustomName(tempName);
    setIsEditing(false);
    localStorage.setItem(`user_name_${ownerAddress}`, tempName);
    toast.success("Name updated successfully");
  };

  const handleCancel = () => {
    setIsEditing(false);
  };

  if (!isOwner && !customName) {
    return null;
  }

  return (
    <div className="flex items-center flex-wrap gap-2">
      {isEditing ? (
        <div className="flex items-center gap-2">
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter your real name"
            className="h-8 w-[200px]"
            autoFocus
          />
          <Button variant="ghost" size="sm" onClick={handleSave} className="h-6 w-6 p-0">
            <Check className="h-3.5 w-3.5 text-green-500" />
          </Button>
          <Button variant="ghost" size="sm" onClick={handleCancel} className="h-6 w-6 p-0">
            <X className="h-3.5 w-3.5 text-destructive" />
          </Button>
        </div>
      ) : (
        <>
          {customName && (
            <div className="flex items-center">
              <span className="text-xl font-bold mr-2">{customName}</span>
              {isOwner && (
                <Button variant="ghost" size="sm" onClick={handleEdit} className="h-6 p-0">
                  <PencilLine className="h-3.5 w-3.5" />
                </Button>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default EditableName;
