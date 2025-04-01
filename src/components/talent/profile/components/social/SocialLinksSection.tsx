
import React from 'react';
import SocialMediaLinks from '../../tabs/social/SocialMediaLinks';
import { Link } from 'lucide-react';

interface SocialLinksSectionProps {
  socials: Record<string, string>;
}

const SocialLinksSection: React.FC<SocialLinksSectionProps> = ({ socials }) => {
  return (
    <div className="w-full mt-6">
      <h3 className="flex items-center gap-2 text-xl font-medium mb-4">
        <Link className="h-5 w-5" /> Social Links
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <SocialMediaLinks socials={socials} />
      </div>
    </div>
  );
};

export default SocialLinksSection;
