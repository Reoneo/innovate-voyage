
import React from 'react';
import HeaderContainer from './components/HeaderContainer';

const ProfileSkeleton: React.FC = () => {
  return (
    <HeaderContainer>
      <div className="flex flex-col md:flex-row gap-8 animate-pulse">
        {/* Avatar and left column skeleton */}
        <div className="md:w-1/3 flex flex-col items-center md:items-start gap-4">
          <div className="w-32 h-32 bg-muted rounded-full"></div>
          <div className="w-32 h-6 bg-muted rounded"></div>
          <div className="w-48 h-4 bg-muted rounded"></div>
          <div className="w-full h-24 bg-muted rounded mt-4"></div>
          <div className="w-full grid grid-cols-4 gap-2 mt-4">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="w-10 h-10 bg-muted rounded-full"></div>
            ))}
          </div>
        </div>
        
        {/* Right column skeleton */}
        <div className="md:w-2/3">
          <div className="w-full h-8 bg-muted rounded mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="mb-6">
              <div className="w-2/3 h-6 bg-muted rounded mb-2"></div>
              <div className="w-full h-4 bg-muted rounded mb-1"></div>
              <div className="w-full h-4 bg-muted rounded mb-1"></div>
              <div className="w-3/4 h-4 bg-muted rounded"></div>
            </div>
          ))}
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileSkeleton;
