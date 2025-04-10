
import React from 'react';
import { Loader2 } from 'lucide-react';

interface ConversationListProps {
  conversations: any[];
  onSelectConversation: (conversation: any) => void;
  isLoading: boolean;
}

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
      <div className="text-center p-4 border rounded-md">
        <p className="text-muted-foreground">No conversations yet</p>
        <p className="text-sm text-muted-foreground mt-1">
          Start a new conversation to begin messaging
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
      {conversations.map((conversation, index) => {
        // Format the peer address for display
        const peerAddress = conversation.peerAddress;
        const displayAddress = `${peerAddress.substring(0, 6)}...${peerAddress.substring(peerAddress.length - 4)}`;
        
        return (
          <div
            key={index}
            onClick={() => onSelectConversation(conversation)}
            className="p-3 border rounded-md hover:bg-accent cursor-pointer transition-colors"
          >
            <div className="font-medium">{displayAddress}</div>
            <div className="text-xs text-muted-foreground mt-1">
              Click to view conversation
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ConversationList;
