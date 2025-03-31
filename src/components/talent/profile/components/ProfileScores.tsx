
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProfileScoresProps {
  category: string;
}

// This component is kept for reference but will no longer be used in the ProfileHeader
const ProfileScores: React.FC<ProfileScoresProps> = ({ category }) => {
  return (
    <div className="hidden">
      <Badge className="text-xs">{category}</Badge>
    </div>
  );
};

export default ProfileScores;
