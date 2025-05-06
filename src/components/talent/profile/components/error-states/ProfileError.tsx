
import React from 'react';
import HeaderContainer from '../../components/HeaderContainer';
import { AlertCircle } from 'lucide-react';

interface ProfileErrorProps {
  ensNameOrAddress?: string;
  error?: string | null;
}

const ProfileError: React.FC<ProfileErrorProps> = ({ ensNameOrAddress, error }) => (
  <div className="min-h-screen py-4 md:py-8">
    <div className="container mx-auto px-4" style={{ maxWidth: '21cm' }}>
      <HeaderContainer>
        <div className="flex flex-col items-center justify-center h-full text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mb-2" />
          <h2 className="text-2xl font-bold mb-2">Error Loading Profile</h2>
          <p className="text-muted-foreground mb-6">
            We couldn't load the profile for {ensNameOrAddress}. 
            <br />Please try again later or check if the ENS name or address is correct.
          </p>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
      </HeaderContainer>
    </div>
  </div>
);

export default ProfileError;
