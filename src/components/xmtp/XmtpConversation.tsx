
import React, { useEffect, useRef, useState } from 'react';
import XmtpMessageList from './XmtpMessageList';
import XmtpMessageComposer from './XmtpMessageComposer';
import { streamMessages, deleteMessage } from '@/services/xmtpService';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { resolvedEns, avatarUrl } = useEnsResolver(undefined, conversation?.peerAddress);
  const [hasLensHandle, setHasLensHandle] = useState(false);
  const { toast } = useToast();
  
  const peerAddress = conversation?.peerAddress;
  const shortAddress = peerAddress 
    ? `${peerAddress.substring(0, 6)}...${peerAddress.substring(peerAddress.length - 4)}`
    : '';
  
  // Check if the address is a Lens handle
  useEffect(() => {
    const checkLensHandle = async () => {
      try {
        // Check if address or ENS contains lens
        const isLens = resolvedEns?.includes('.lens') || peerAddress?.toLowerCase().includes('lens');
        setHasLensHandle(!!isLens);
      } catch (error) {
        console.error("Error checking Lens handle:", error);
      }
    };
    
    if (peerAddress) {
      checkLensHandle();
    }
  }, [peerAddress, resolvedEns]);
  
  const displayName = resolvedEns || shortAddress;

  const handleMessageSent = (newMessage: any) => {
    setMessages(prev => [...prev, newMessage]);
  };

  const handleDeleteMessage = async (messageId: string) => {
    try {
      // Delete the message using XMTP API
      await deleteMessage(conversation, messageId);
      
      // Remove the message from the UI
      setMessages(prev => prev.filter(message => message.id !== messageId));
      
      toast({
        title: "Message deleted",
        description: "Message was successfully deleted"
      });
    } catch (error) {
      console.error("Error deleting message:", error);
      toast({
        title: "Error deleting message",
        description: "There was a problem deleting your message",
        variant: "destructive"
      });
      throw error; // Re-throw to handle in the UI
    }
  };

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
    <div className="space-y-3">
      {/* Conversation header with peer info */}
      <div className="p-2 border-b flex items-center gap-2">
        <Avatar className="h-8 w-8">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-xs">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium text-sm">{displayName}</div>
          {resolvedEns && <div className="text-xs text-muted-foreground">{shortAddress}</div>}
          {hasLensHandle && (
            <div className="text-xs text-purple-500">Lens Profile</div>
          )}
        </div>
      </div>
      
      {/* Messages container */}
      <div className="h-[250px] overflow-y-auto border rounded-md p-3 space-y-2 bg-background">
        <XmtpMessageList 
          messages={messages} 
          currentUserAddress={window.connectedWalletAddress}
          onDeleteMessage={handleDeleteMessage}
        />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message composer */}
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
