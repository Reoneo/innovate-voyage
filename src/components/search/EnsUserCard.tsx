
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin } from 'lucide-react';
import { EnsUser } from '@/api/services/ensSearchService';

interface EnsUserCardProps {
  user: EnsUser;
  onClick: (user: EnsUser) => void;
}

const EnsUserCard: React.FC<EnsUserCardProps> = ({ user, onClick }) => {
  return (
    <Card 
      className="cursor-pointer hover:shadow-lg transition-shadow duration-200 hover:scale-105"
      onClick={() => onClick(user)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col items-center text-center space-y-3">
          <Avatar className="w-16 h-16">
            <AvatarImage src={user.avatar || undefined} alt={user.displayName} />
            <AvatarFallback>
              {user.displayName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="space-y-1">
            <h3 className="font-semibold text-sm">{user.displayName}</h3>
            <p className="text-xs text-blue-600">{user.ensName}</p>
            
            {user.location && (
              <div className="flex items-center justify-center text-xs text-muted-foreground">
                <MapPin className="w-3 h-3 mr-1" />
                {user.location}
              </div>
            )}
            
            {user.bio && (
              <p className="text-xs text-muted-foreground line-clamp-2">
                {user.bio}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EnsUserCard;
