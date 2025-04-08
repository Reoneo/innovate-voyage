
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface SkillBadgeProps {
  name: string;
  proof?: string;
  variant?: 'credential' | 'verified' | 'unverified';
}

const SkillBadge: React.FC<SkillBadgeProps> = ({ name, proof, variant = 'unverified' }) => {
  // Determine the badge styling based on the variant
  const getBadgeStyle = () => {
    if (variant === 'credential') {
      return "bg-blue-500 hover:bg-blue-600";
    } else if (variant === 'verified') {
      return "bg-green-500 hover:bg-green-600";
    } else {
      return "text-gray-600 border-gray-400";
    }
  };

  return (
    <Badge 
      variant={variant === 'unverified' ? "outline" : "default"} 
      className={getBadgeStyle()}
    >
      {name}
    </Badge>
  );
};

export default SkillBadge;
