
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Briefcase, Network, Link } from 'lucide-react';

interface ProfileNavigationBarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
}

const ProfileNavigationBar: React.FC<ProfileNavigationBarProps> = ({
  activeTab,
  onTabChange
}) => {
  return (
    <Tabs value={activeTab} onValueChange={onTabChange} className="w-full">
      <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto">
        <TabsTrigger value="skills" className="flex items-center gap-2">
          <Briefcase className="h-4 w-4" />
          <span className="hidden sm:inline">Skills</span>
        </TabsTrigger>
        <TabsTrigger value="blockchain" className="flex items-center gap-2">
          <Network className="h-4 w-4" />
          <span className="hidden sm:inline">Blockchain</span>
        </TabsTrigger>
        <TabsTrigger value="links" className="flex items-center gap-2">
          <Link className="h-4 w-4" />
          <span className="hidden sm:inline">Links</span>
        </TabsTrigger>
      </TabsList>
    </Tabs>
  );
};

export default ProfileNavigationBar;
