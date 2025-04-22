
import React from 'react';
import { Mail, Phone } from 'lucide-react';

interface ProfileContactProps {
  email?: string;
  telephone?: string;
  location?: string;
  isOwner?: boolean;
  passportId?: string;
  ownerAddress?: string;
  socials?: Record<string, string>;
}

const ProfileContact: React.FC<ProfileContactProps> = ({ 
  email, 
  telephone, 
  isOwner = false,
  socials = {},
  // We're adding passportId and ownerAddress to the props but not using them
  // in this component directly - they might be needed for future functionality
  passportId, 
  ownerAddress 
}) => {
  // Use email and telephone from props or extract from socials
  const contactEmail = email || socials?.email;
  const contactPhone = telephone || socials?.telephone;
  
  if (!contactEmail && !contactPhone && !isOwner) {
    return null;
  }

  return (
    <div className="w-full text-sm text-muted-foreground space-y-1 mt-2 text-center">
      {contactPhone && (
        <div className="flex items-center gap-2 justify-center">
          <Phone className="h-4 w-4" />
          <span>Tel: {contactPhone}</span>
        </div>
      )}
      {contactEmail && (
        <div className="flex items-center gap-2 justify-center">
          <Mail className="h-4 w-4" />
          <span>Email: {contactEmail}</span>
        </div>
      )}
    </div>
  );
};

export default ProfileContact;
