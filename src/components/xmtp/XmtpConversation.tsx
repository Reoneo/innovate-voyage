
import React from 'react';
import XmtpMessageList from './XmtpMessageList';
import XmtpMessageComposer from './XmtpMessageComposer';

interface XmtpConversationProps {
  conversation: any;
  messages: any[];
  setMessages: React.Dispatch<React.SetStateAction<any[]>>;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const XmtpConversation: React.FC<XmtpConversationProps> = ({
  conversation,
  messages,
  setMessages,
  isLoading,
  setIsLoading
}) => {
  const handleMessageSent = (newMessage: any) => {
    setMessages(prev => [...prev, newMessage]);
  };

  return (
    <div className="space-y-4">
      <div className="h-60 overflow-y-auto border rounded-md p-3 space-y-2 bg-background">
        <XmtpMessageList 
          messages={messages} 
          currentUserAddress={window.connectedWalletAddress} 
        />
      </div>
      
      <XmtpMessageComposer
        conversation={conversation}
        onMessageSent={handleMessageSent}
        isLoading={isLoading}
        setIsLoading={setIsLoading}
      />
    </div>
  );
};

export default XmtpConversation;
