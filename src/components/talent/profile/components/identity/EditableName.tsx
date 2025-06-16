
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PencilLine, Check, X } from 'lucide-react';
import { toast } from 'sonner';
import { secureStorage, validateInput } from '@/utils/securityUtils';

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
    const loadName = async () => {
      const savedName = await secureStorage.getItem(`user_name_${ownerAddress}`);
      if (savedName) {
        setCustomName(savedName);
      }
    };
    if (ownerAddress) {
      loadName();
    }
  }, [ownerAddress]);

  const handleEdit = () => {
    setTempName(customName);
    setIsEditing(true);
  };

  const handleSave = async () => {
    const sanitizedName = validateInput.sanitizeString(tempName);
    setCustomName(sanitizedName);
    setIsEditing(false);
    await secureStorage.setItem(`user_name_${ownerAddress}`, sanitizedName);
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
