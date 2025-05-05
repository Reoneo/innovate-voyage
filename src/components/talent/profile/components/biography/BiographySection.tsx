
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

interface BiographySectionProps {
  biography?: string;
  bio?: string; // Add bio prop as an alias for biography
  isOwner?: boolean;
  onSave?: (bio: string) => void;
}

const BiographySection: React.FC<BiographySectionProps> = ({
  biography,
  bio, // Accept bio prop
  isOwner = false,
  onSave
}) => {
  // Use either biography or bio prop, preferring biography if both are provided
  const biographyText = biography || bio || '';
  
  const [isEditing, setIsEditing] = useState(false);
  const [bioValue, setBioValue] = useState(biographyText);
  
  const handleSave = () => {
    if (onSave) {
      onSave(bioValue);
    }
    setIsEditing(false);
  };
  
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-xl">Biography</CardTitle>
        {isOwner && (
          isEditing ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 px-2"
            >
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(true)}
              className="h-8 px-2"
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
          )
        )}
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={bioValue}
            onChange={(e) => setBioValue(e.target.value)}
            placeholder="Write your professional biography here..."
            className="min-h-[150px]"
          />
        ) : (
          <div className="space-y-2">
            {biographyText ? (
              <p className="text-xl text-black font-medium leading-relaxed whitespace-pre-wrap">
                {biographyText}
              </p>
            ) : (
              <p className="text-muted-foreground italic">
                No biography available
              </p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BiographySection;
