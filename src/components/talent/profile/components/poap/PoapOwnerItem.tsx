
import React from 'react';
import { Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useEnsResolver } from '@/hooks/useEnsResolver';

interface PoapOwnerItemProps {
  owner: {
    owner: string;
    [key: string]: any;
  };
}

const PoapOwnerItem: React.FC<PoapOwnerItemProps> = ({
  owner
}) => {
  const {
    resolvedEns,
    avatarUrl
  } = useEnsResolver(undefined, owner.owner);
  const shortAddress = `${owner.owner.substring(0, 6)}...${owner.owner.substring(owner.owner.length - 4)}`;
  const displayName = resolvedEns || shortAddress;

  return (
    <Link to={`/${resolvedEns || owner.owner}/`} className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors">
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || ''} />
        <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
      </Avatar>
      <span className="text-sm font-medium">{displayName}</span>
    </Link>
  );
};

export default PoapOwnerItem;
