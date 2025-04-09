
import React from 'react';

interface Message {
  content: string;
  senderAddress: string;
  sent: Date;
}

interface XmtpMessageListProps {
  messages: Message[];
  currentUserAddress: string | null;
}

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

  return (
    <div className="flex flex-col space-y-3">
      {messages.map((msg, idx) => (
        <div 
          key={idx} 
          className={`p-3 rounded-lg max-w-[80%] ${
            msg.senderAddress === currentUserAddress 
              ? 'bg-primary text-primary-foreground ml-auto' 
              : 'bg-secondary text-secondary-foreground'
          }`}
        >
          <p className="text-sm">{msg.content}</p>
          <p className="text-xs opacity-70 mt-1">
            {new Date(msg.sent).toLocaleTimeString()}
          </p>
        </div>
      ))}
    </div>
  );
};

export default XmtpMessageList;
