
import React from 'react';
import HeaderContainer from './components/HeaderContainer';

const ProfileSkeleton: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="flex justify-center items-center h-[29.7cm] w-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
          <p className="text-muted-foreground">Loading profile data...</p>
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileSkeleton;
