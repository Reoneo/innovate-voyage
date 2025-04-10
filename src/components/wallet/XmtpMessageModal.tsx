
import React, { useState, useEffect } from 'react';
import { X, MessageSquare, PlusCircle, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import XmtpConnectionSection from '../xmtp/XmtpConnectionSection';
import XmtpConversationStarter from '../xmtp/XmtpConversationStarter';
import XmtpConversation from '../xmtp/XmtpConversation';
import ConversationList from '../xmtp/ConversationList';
import { getConversations } from '@/services/xmtpService';

const XmtpMessageModal: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);

  const handleConnect = async (client: any) => {
    setXmtpClient(client);
    setIsConnected(true);
    
    // Load existing conversations
    setIsLoading(true);
    try {
      const existingConversations = await getConversations(client);
      setConversations(existingConversations);
    } catch (error) {
      console.error("Error loading conversations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConversationStarted = async (conversation: any, existingMessages: any[]) => {
    setCurrentConversation(conversation);
    setMessages(existingMessages);
    setShowNewConversation(false);
    
    // Add to conversations list if not already there
    const conversationExists = conversations.some(
      conv => conv.peerAddress === conversation.peerAddress
    );
    
    if (!conversationExists) {
      setConversations(prev => [conversation, ...prev]);
    }
  };

  const handleSelectConversation = async (conversation: any) => {
    if (currentConversation?.peerAddress === conversation.peerAddress) return;
    
    setIsLoading(true);
    setCurrentConversation(conversation);
    
    try {
      // Load messages for the selected conversation
      const existingMessages = await conversation.messages();
      setMessages(existingMessages);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const closeModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.close();
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
    setShowNewConversation(true);
  };

  const backToConversations = () => {
    setCurrentConversation(null);
    setShowNewConversation(false);
  };

  return (
    <dialog id="xmtpMessageModal" className="modal backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg shadow-xl p-0 w-[90%] max-w-md">
      <div className="bg-background p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4 border-b pb-3">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            XMTP Messaging
          </h3>
          <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected ? (
          <XmtpConnectionSection 
            onConnect={handleConnect}
            isLoading={isLoading}
            setIsLoading={setIsLoading}
          />
        ) : (
          <div className="space-y-4">
            {currentConversation ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={backToConversations}
                  className="pl-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <XmtpConversation
                  conversation={currentConversation}
                  messages={messages}
                  setMessages={setMessages}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </>
            ) : showNewConversation ? (
              <>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={backToConversations}
                  className="pl-1"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                <XmtpConversationStarter
                  xmtpClient={xmtpClient}
                  onConversationStarted={handleConversationStarted}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </>
            ) : (
              <>
                <Button 
                  onClick={startNewConversation} 
                  className="w-full mb-4"
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
                <ConversationList 
                  conversations={conversations}
                  onSelectConversation={handleSelectConversation}
                  isLoading={isLoading}
                />
              </>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default XmtpMessageModal;
