
import React, { useState } from 'react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Message {
  content: string;
  senderAddress: string;
  sent: Date;
  id?: string;
}

interface XmtpMessageListProps {
  messages: Message[];
  currentUserAddress: string | null;
  onDeleteMessage?: (messageId: string) => Promise<void>;
}

const MessageBubble = ({ 
  message, 
  isOwnMessage, 
  currentUserAddress,
  onDelete
}: { 
  message: Message, 
  isOwnMessage: boolean,
  currentUserAddress: string | null,
  onDelete?: () => Promise<void>
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const address = isOwnMessage ? currentUserAddress : message.senderAddress;
  const { resolvedEns, avatarUrl } = useEnsResolver(undefined, address || undefined);
  
  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : 'Unknown';
    
  const displayName = resolvedEns || shortAddress;

  const handleDelete = async () => {
    if (onDelete) {
      setIsDeleting(true);
      try {
        await onDelete();
      } catch (error) {
        console.error("Error deleting message:", error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4 group`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mr-2 mt-1 border">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%] relative`}>
        {!isOwnMessage && (
          <div className="text-xs text-muted-foreground mb-1 ml-1">{displayName}</div>
        )}
        <div className={`p-3 rounded-lg ${
          isOwnMessage 
            ? 'bg-primary text-primary-foreground rounded-tr-none' 
            : 'bg-secondary text-secondary-foreground rounded-tl-none'
        }`}>
          <p className="text-sm break-words">{message.content}</p>
          <p className="text-xs opacity-70 mt-1 text-right">
            {new Date(message.sent).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
          </p>
        </div>
        
        {isOwnMessage && message.id && onDelete && (
          <div className="absolute right-0 top-0 -mt-1 -mr-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                  <span className="sr-only">Message options</span>
                  <span className="text-xs">•••</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem 
                  className="text-destructive focus:text-destructive flex items-center" 
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  {isDeleting ? "Deleting..." : "Delete message"}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
      
      {isOwnMessage && (
        <Avatar className="h-8 w-8 ml-2 mt-1 border">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
    </div>
  );
};

const XmtpMessageList: React.FC<XmtpMessageListProps> = ({
  messages,
  currentUserAddress,
  onDeleteMessage
}) => {
  if (messages.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-center text-muted-foreground text-sm">No messages yet</p>
      </div>
    );
  }

  // Group messages by date
  const messagesByDate: {[key: string]: Message[]} = {};
  messages.forEach(message => {
    const date = new Date(message.sent).toLocaleDateString();
    if (!messagesByDate[date]) {
      messagesByDate[date] = [];
    }
    messagesByDate[date].push(message);
  });

  return (
    <div className="flex flex-col space-y-4">
      {Object.entries(messagesByDate).map(([date, dateMessages]) => (
        <div key={date}>
          <div className="text-center my-3">
            <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded-full">
              {date === new Date().toLocaleDateString() ? 'Today' : date}
            </span>
          </div>
          
          {dateMessages.map((msg, idx) => (
            <MessageBubble 
              key={idx}
              message={msg}
              isOwnMessage={msg.senderAddress === currentUserAddress}
              currentUserAddress={currentUserAddress}
              onDelete={onDeleteMessage && msg.id && msg.senderAddress === currentUserAddress 
                ? () => onDeleteMessage(msg.id!) 
                : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default XmtpMessageList;
