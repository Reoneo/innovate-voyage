
import React, { useEffect } from 'react';
import XmtpMessageList from './XmtpMessageList';
import XmtpMessageComposer from './XmtpMessageComposer';
import { streamMessages } from '@/services/xmtpService';

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

  // Set up message streaming to receive new messages
  useEffect(() => {
    if (!conversation) return;

    // Only set up streaming if we have a conversation
    let isMounted = true;
    
    const setupMessageStream = async () => {
      try {
        // This will listen for new incoming messages
        const stream = await conversation.streamMessages();
        
        (async () => {
          for await (const msg of stream) {
            // Only add messages if component is still mounted
            if (isMounted) {
              // Make sure we don't duplicate messages
              setMessages(prev => {
                const messageExists = prev.some(m => 
                  m.id === msg.id || 
                  (m.content === msg.content && 
                   m.senderAddress === msg.senderAddress &&
                   m.sent.getTime() === msg.sent.getTime())
                );
                
                if (messageExists) return prev;
                return [...prev, msg];
              });
            }
          }
        })();
      } catch (error) {
        console.error("Error streaming messages:", error);
      }
    };

    setupMessageStream();
    
    // Cleanup function to prevent memory leaks
    return () => {
      isMounted = false;
    };
  }, [conversation, setMessages]);

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
