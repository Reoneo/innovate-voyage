
import React from 'react';
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
  
  // Handle Lens handles and other non-Ethereum addresses
  const isLensHandle = typeof peerAddress === 'string' && peerAddress.endsWith('.lens');
  const displayAddress = isLensHandle ? peerAddress : (
    typeof peerAddress === 'string' ? `${peerAddress.substring(0, 6)}...${peerAddress.substring(peerAddress.length - 4)}` : 'Unknown'
  );
  
  const { resolvedEns, avatarUrl, isLoading } = useEnsResolver(undefined, isLensHandle ? undefined : peerAddress);
  
  // For Lens handles, we could get avatar from Lens API but for now we'll use a fallback
  const displayName = isLensHandle ? peerAddress : (resolvedEns || displayAddress);
  
  return (
    <div
      onClick={onClick}
      className="p-3 border rounded-md hover:bg-accent cursor-pointer transition-colors flex items-center gap-3"
    >
      <Avatar className="h-12 w-12 border">
        <AvatarImage src={avatarUrl || ''} alt={displayName} />
        <AvatarFallback className="bg-primary/10 text-primary text-sm">
          {(displayName ? displayName.substring(0, 2).toUpperCase() : 'UN')}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-base truncate">
          {isLoading ? displayAddress : displayName}
        </div>
        <div className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
          <MessageCircle className="h-3 w-3" />
          <span>Click to view conversation</span>
          {isLensHandle && <span className="text-purple-500 ml-1">(Lens)</span>}
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
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <p className="text-lg font-medium text-gray-700">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-2">
          Start a new conversation to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
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
