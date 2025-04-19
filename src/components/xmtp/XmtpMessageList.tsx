
import React from 'react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface Message {
  content: string;
  senderAddress: string;
  sent: Date;
}

interface XmtpMessageListProps {
  messages: Message[];
  currentUserAddress: string | null;
}

const MessageBubble = ({ message, isOwnMessage, currentUserAddress }: { 
  message: Message, 
  isOwnMessage: boolean,
  currentUserAddress: string | null
}) => {
  const address = isOwnMessage ? currentUserAddress : message.senderAddress;
  const { resolvedEns, avatarUrl } = useEnsResolver(undefined, address || undefined);
  
  const shortAddress = address 
    ? `${address.substring(0, 6)}...${address.substring(address.length - 4)}`
    : 'Unknown';
    
  const displayName = resolvedEns || shortAddress;
  
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      {!isOwnMessage && (
        <Avatar className="h-8 w-8 mr-2 mt-1 border">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[80%]`}>
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
  currentUserAddress
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
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default XmtpMessageList;
