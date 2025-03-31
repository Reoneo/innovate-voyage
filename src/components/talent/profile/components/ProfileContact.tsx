
import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

interface ProfileContactProps {
  email?: string;
  telephone?: string;
  location?: string;
}

const ProfileContact: React.FC<ProfileContactProps> = ({ email, telephone, location }) => {
  if (!email && !telephone && !location) {
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
    </div>
  );
};

export default ProfileContact;
