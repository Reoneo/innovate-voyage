
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface SkillItemProps {
  name: string;
  isVerified: boolean;
  isOwner: boolean;
  onRemove?: (skillName: string) => void;
}

const SkillItem: React.FC<SkillItemProps> = ({ name, isVerified, isOwner, onRemove }) => {
  return (
    <div className="relative group">
      <Badge 
        variant={isVerified ? "default" : "outline"} 
        className={isVerified ? "bg-green-500 hover:bg-green-600" : "text-gray-600 border-gray-400 pr-7"}
      >
        {name}
      </Badge>
      {!isVerified && isOwner && onRemove && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="absolute right-0 top-1/2 transform -translate-y-1/2 h-5 w-5 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => onRemove(name)}
          aria-label={`Remove ${name} skill`}
        >
          <X className="h-3 w-3 text-muted-foreground hover:text-destructive" />
        </Button>
      )}
    </div>
  );
};

export default SkillItem;
