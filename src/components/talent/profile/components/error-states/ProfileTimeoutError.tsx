
import React from 'react';
import HeaderContainer from '../../components/HeaderContainer';

interface ProfileTimeoutErrorProps {
  ensNameOrAddress?: string;
}

const ProfileTimeoutError: React.FC<ProfileTimeoutErrorProps> = ({ ensNameOrAddress }) => (
  <div className="min-h-screen bg-gray-50 py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. The request timed out.
          </p>
        </div>
      </HeaderContainer>
    </div>
  </div>
);

export default ProfileTimeoutError;
