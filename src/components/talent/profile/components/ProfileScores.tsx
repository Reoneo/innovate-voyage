
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ProfileScoresProps {
  category: string;
}

const ProfileScores: React.FC<ProfileScoresProps> = ({ category }) => {
  return (
    <div className="flex flex-col items-center">
      <div className="mt-2">
        <Badge className="text-xs">{category}</Badge>
      </div>
    </div>
  );
};

export default ProfileScores;
