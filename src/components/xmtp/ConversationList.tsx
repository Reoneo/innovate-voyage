
import React, { useEffect, useState } from 'react';
import { Loader2, MessageCircle } from 'lucide-react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ConversationListProps {
  conversations: any[];
  onSelectConversation: (conversation: any) => void;
  isLoading: boolean;
}

const ConversationItem = ({ conversation, onClick }: { conversation: any, onClick: () => void }) => {
  const peerAddress = conversation.peerAddress;
  const shortAddress = `${peerAddress.substring(0, 6)}...${peerAddress.substring(peerAddress.length - 4)}`;
  const { resolvedEns, avatarUrl, isLoading } = useEnsResolver(undefined, peerAddress);
  
  return (
    <div
      onClick={onClick}
      className="p-3 border rounded-md hover:bg-accent cursor-pointer transition-colors flex items-center gap-3"
    >
      <Avatar className="h-9 w-9 border">
        <AvatarImage src={avatarUrl || ''} alt={resolvedEns || shortAddress} />
        <AvatarFallback className="bg-primary/10 text-primary text-xs">
          {(resolvedEns ? resolvedEns.substring(0, 2).toUpperCase() : peerAddress.substring(0, 2).toUpperCase())}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">
          {isLoading ? shortAddress : (resolvedEns || shortAddress)}
        </div>
        <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>Click to view</span>
        </div>
      </div>
    </div>
  );
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  isLoading
}) => {
  if (isLoading) {
    return (
      <div className="flex justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center p-4 border rounded-md bg-muted/30">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start a new conversation to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {conversations.map((conversation, index) => (
        <ConversationItem 
          key={index}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
