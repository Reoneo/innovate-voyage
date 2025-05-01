
import React from 'react';
import { Loader2, MessageCircle, Trash2 } from 'lucide-react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

interface ConversationListProps {
  conversations: any[];
  onSelectConversation: (conversation: any) => void;
  onDeleteConversation: (conversation: any) => void;
  isLoading: boolean;
}

const ConversationItem = ({ 
  conversation, 
  onClick, 
  onDelete 
}: { 
  conversation: any, 
  onClick: () => void,
  onDelete: () => void
}) => {
  const peerAddress = conversation.peerAddress;
  
  // Handle Lens handles and other non-Ethereum addresses
  const isLensHandle = typeof peerAddress === 'string' && peerAddress.endsWith('.lens');
  const displayAddress = isLensHandle ? peerAddress : (
    typeof peerAddress === 'string' ? `${peerAddress.substring(0, 6)}...${peerAddress.substring(peerAddress.length - 4)}` : 'Unknown'
  );
  
  const { resolvedEns, avatarUrl, isLoading } = useEnsResolver(undefined, isLensHandle ? undefined : peerAddress);
  
  // For Lens handles, we could get avatar from Lens API but for now we'll use a fallback
  const displayName = isLensHandle ? peerAddress : (resolvedEns || displayAddress);
  
  return (
    <div className="p-3 border rounded-md hover:bg-accent transition-colors flex items-center gap-3 group">
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {(displayName ? displayName.substring(0, 2).toUpperCase() : 'UN')}
        </AvatarFallback>
      </Avatar>
      <div 
        className="flex-1 min-w-0 cursor-pointer"
        onClick={onClick}
      >
        <div className="font-semibold text-base truncate">
          {isLoading ? displayAddress : displayName}
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>Click to view conversation</span>
          {isLensHandle && <span className="text-purple-500 ml-1">(Lens)</span>}
        </div>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-600 hover:bg-red-100"
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
      >
        <Trash2 className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
};

const ConversationList: React.FC<ConversationListProps> = ({
  conversations,
  onSelectConversation,
  onDeleteConversation,
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
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <p className="text-lg font-medium text-gray-700">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start a new conversation to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation, index) => (
        <ConversationItem 
          key={index}
          conversation={conversation}
          onClick={() => onSelectConversation(conversation)}
          onDelete={() => onDeleteConversation(conversation)}
        />
      ))}
    </div>
  );
};

export default ConversationList;
