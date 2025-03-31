
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ProfileContactProps {
  email?: string;
  telephone?: string;
  location?: string;
  isOwner?: boolean;
  passportId?: string;
  ownerAddress?: string;
}

const ProfileContact: React.FC<ProfileContactProps> = ({ 
  email, 
  telephone, 
  location, 
  isOwner = false,
  // We're adding passportId and ownerAddress to the props but not using them
  // in this component directly - they might be needed for future functionality
  passportId, 
  ownerAddress 
}) => {
  if (!email && !telephone && !location && !isOwner) {
    return null;
  }

  return (
    <div className="w-full text-sm text-muted-foreground space-y-1 mt-2">
      {telephone && (
        <div className="flex items-center gap-2">
          <Phone className="h-4 w-4" />
          <span>Tel: {telephone}</span>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-2">
          <Mail className="h-4 w-4" />
          <span>Email: {email}</span>
        </div>
      )}
      {location && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>Location: {location}</span>
        </div>
      )}
      {!location && isOwner && (
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span className="text-muted-foreground/75 italic">Connect wallet to add location</span>
        </div>
      )}
    </div>
  );
};

export default ProfileContact;
