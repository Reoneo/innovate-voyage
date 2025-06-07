
import React from 'react';
import { Mail, Phone, MapPin, Globe } from 'lucide-react';

interface ProfileContactProps {
  email?: string;
  telephone?: string;
  location?: string;
  website?: string;
  isOwner?: boolean;
  passportId?: string;
  ownerAddress?: string;
}

const ProfileContact: React.FC<ProfileContactProps> = ({ 
  email, 
  telephone, 
  location,
  website,
  isOwner = false,
  passportId, 
  ownerAddress 
}) => {
  if (!email && !telephone && !location && !website && !isOwner) {
    return null;
  }

  return (
    <div className="w-full text-sm text-muted-foreground space-y-2 mt-2 text-center">
      {telephone && (
        <div className="flex items-center gap-2 justify-center">
          <Phone className="h-4 w-4" />
          <a href={`tel:${telephone}`} className="hover:text-primary transition-colors">
            {telephone}
          </a>
        </div>
      )}
      {email && (
        <div className="flex items-center gap-2 justify-center">
          <Mail className="h-4 w-4" />
          <a href={`mailto:${email}`} className="hover:text-primary transition-colors">
            {email}
          </a>
        </div>
      )}
      {location && (
        <div className="flex items-center gap-2 justify-center">
          <MapPin className="h-4 w-4" />
          <span>{location}</span>
        </div>
      )}
      {website && (
        <div className="flex items-center gap-2 justify-center">
          <Globe className="h-4 w-4" />
          <a 
            href={website.startsWith('http') ? website : `https://${website}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="hover:text-primary transition-colors"
          >
            {website}
          </a>
        </div>
      )}
    </div>
  );
};

export default ProfileContact;
