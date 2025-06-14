
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { ExternalLink, Shield, Clock } from 'lucide-react';
import { SpruceIdUser } from '@/api/services/spruceIdService';
import { formatDistanceToNow } from 'date-fns';

interface SpruceIdUserCardProps {
  user: SpruceIdUser;
}

const SpruceIdUserCard: React.FC<SpruceIdUserCardProps> = ({ user }) => {
  const getDisplayName = () => {
    if (user.handle) return `@${user.handle}`;
    if (user.domain) return user.domain;
    if (user.address) return `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
    return user.did.split(':').pop()?.slice(0, 8) || 'Unknown';
  };

  const getProfileUrl = () => {
    if (user.address) return `/${user.address}`;
    if (user.domain) return `/${user.domain}`;
    return '#';
  };

  const getPlatformColor = () => {
    switch (user.platform) {
      case 'GitHub': return 'bg-gray-900 text-white';
      case 'Twitter': return 'bg-blue-500 text-white';
      case 'DNS': return 'bg-green-600 text-white';
      case 'Cross-Chain': return 'bg-purple-600 text-white';
      default: return 'bg-slate-600 text-white';
    }
  };

  const getAvatarFallback = () => {
    const name = getDisplayName();
    return name.slice(0, 2).toUpperCase();
  };

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex items-start space-x-3">
          <Avatar className="h-10 w-10">
            <AvatarFallback className="text-sm font-medium">
              {getAvatarFallback()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2 mb-2">
              <Link 
                to={getProfileUrl()}
                className="font-medium text-foreground hover:text-primary transition-colors truncate"
              >
                {getDisplayName()}
              </Link>
              <Shield className="h-4 w-4 text-green-600" title="Verified Credential" />
            </div>
            
            <div className="flex items-center space-x-2 mb-2">
              <Badge variant="secondary" className={`text-xs ${getPlatformColor()}`}>
                {user.platform || 'Verified'}
              </Badge>
              <span className="text-xs text-muted-foreground">
                {user.credentialType.replace('Credential', '')}
              </span>
            </div>
            
            <div className="flex items-center space-x-1 text-xs text-muted-foreground">
              <Clock className="h-3 w-3" />
              <span>
                {formatDistanceToNow(new Date(user.issuanceDate), { addSuffix: true })}
              </span>
            </div>
            
            {user.domain && (
              <div className="flex items-center space-x-1 mt-1">
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground truncate">
                  {user.domain}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpruceIdUserCard;
