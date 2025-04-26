
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
      <div className="bg-background p-0 rounded-lg flex flex-col h-[650px]">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            XMTP Messaging
          </h3>
          <Button variant="ghost" size="icon" onClick={closeModal} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>
        
        {!isConnected ? (
          <div className="p-4 flex-1 flex items-center justify-center">
            <XmtpConnectionSection 
              onConnect={handleConnect}
              isLoading={isLoading}
              setIsLoading={setIsLoading}
            />
          </div>
        ) : (
          <div className="flex-1 flex flex-col overflow-hidden">
            {currentConversation ? (
              <div className="flex flex-col h-full">
                <div className="p-2 border-b">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={backToConversations}
                    className="pl-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back to Conversations
                  </Button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <XmtpConversation
                    conversation={currentConversation}
                    messages={messages}
                    setMessages={setMessages}
                    isLoading={isLoading}
                    setIsLoading={setIsLoading}
                  />
                </div>
              </div>
            ) : showNewConversation ? (
              <div className="p-4">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={backToConversations}
                  className="pl-1 mb-4"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back to Conversations
                </Button>
                <XmtpConversationStarter
                  xmtpClient={xmtpClient}
                  onConversationStarted={handleConversationStarted}
                  isLoading={isLoading}
                  setIsLoading={setIsLoading}
                />
              </div>
            ) : (
              <div className="p-4 space-y-4 flex-1 overflow-y-auto">
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
              </div>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default XmtpMessageModal;
