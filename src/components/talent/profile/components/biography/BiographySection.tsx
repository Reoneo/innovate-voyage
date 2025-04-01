
import React from 'react';

interface BiographySectionProps {
  bio?: string;
}

const BiographySection: React.FC<BiographySectionProps> = ({ bio }) => {
  return (
    <div className="w-full mt-4 mb-2 text-sm">
      <h3 className="text-xl font-medium mb-2">Bio</h3>
      {bio ? (
        <p className="text-muted-foreground whitespace-pre-wrap break-words">{bio}</p>
      ) : (
        <p className="text-muted-foreground italic">No bio available</p>
      )}
    </div>
  );
};

export default BiographySection;
