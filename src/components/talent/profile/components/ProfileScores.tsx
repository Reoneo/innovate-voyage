
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProfileScoresProps {
  category: string;
}

const ProfileScores: React.FC<ProfileScoresProps> = ({ category }) => {
  return (
    <div className="flex items-center justify-center">
      <Badge className="text-xs">{category}</Badge>
    </div>
  );
};

export default ProfileScores;
