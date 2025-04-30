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
    <div className="flex flex-col h-full overflow-hidden">
      {/* Conversation header with peer info and gradient */}
      <div className="p-3 border-b flex items-center gap-3 bg-gradient-to-r from-[#9b87f5]/50 to-[#7856FF]/30">
        <Avatar className="h-10 w-10 ring-2 ring-white/30">
          <AvatarImage src={avatarUrl || ''} alt={displayName} />
          <AvatarFallback className="bg-primary/10 text-primary text-sm">
            {displayName.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <div className="font-semibold text-base">{displayName}</div>
          {resolvedEns && <div className="text-xs text-muted-foreground">{shortAddress}</div>}
          {hasLensHandle && (
            <div className="text-xs text-purple-500 font-medium">Lens Profile</div>
          )}
        </div>
      </div>
      
      {/* Messages container with modern chat background pattern */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-2"
        style={{
          backgroundImage: "url('data:image/svg+xml;charset=utf-8,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22 viewBox=%220 0 100 100%22%3E%3Cg fill-rule=%22evenodd%22%3E%3Cg fill=%22%239b87f5%22%3E%3Cpath opacity=%22.05%22 d=%22M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
          backgroundColor: "#f9f8fe"
        }}
      >
        <XmtpMessageList 
          messages={messages} 
          currentUserAddress={window.connectedWalletAddress}
          onDeleteMessage={handleDeleteMessage}
        />
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message composer with subtle gradient */}
      <div className="p-3 border-t bg-gradient-to-r from-[#F1F0FB] to-white">
        <XmtpMessageComposer
          conversation={conversation}
          onMessageSent={handleMessageSent}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};

export default XmtpConversation;
