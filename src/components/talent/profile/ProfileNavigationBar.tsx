
import React from 'react';
import { Separator } from '@/components/ui/separator';
import { Box, Link, BookOpen } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileNavigationBarProps {
  activeTab: string;
  setActiveTab: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileNavigationBar: React.FC<ProfileNavigationBarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'skills', label: 'Skills', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'blockchain', label: 'Blockchain', icon: <Box className="h-4 w-4" /> },
    { id: 'links', label: 'Links', icon: <Link className="h-4 w-4" /> }
  ];

  return (
    <div>
      <nav className="flex items-center gap-4 sm:gap-6">
        {tabs.map((tab) => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-1 py-2 text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "border-b-2 border-primary text-foreground"
                : "border-b-2 border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>
      <Separator className="mt-0 mb-4" />
    </div>
  );
};

export default ProfileNavigationBar;
