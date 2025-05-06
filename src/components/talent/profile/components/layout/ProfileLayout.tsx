
import React from 'react';
import HeaderContainer from '../HeaderContainer';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProfileLayoutProps {
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
}

const ProfileLayout: React.FC<ProfileLayoutProps> = ({ leftColumn, rightColumn }) => {
  const isMobile = useIsMobile();

  return (
    <HeaderContainer>
      <div className="w-full grid grid-cols-1 md:grid-cols-10 gap-6 h-full">
        <div className={`${isMobile ? 'w-full' : 'md:col-span-3'} flex flex-col space-y-4`}>
          {leftColumn}
        </div>
        <div className={`${isMobile ? 'w-full' : 'md:col-span-7'} space-y-6`}>
          {rightColumn}
        </div>
      </div>
    </HeaderContainer>
  );
};

export default ProfileLayout;
