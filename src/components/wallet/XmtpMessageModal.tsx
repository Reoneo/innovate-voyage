import React, { useState, useEffect } from 'react';
import { X, MessageSquare, PlusCircle, ArrowLeft, Trash2, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import XmtpConnectionSection from '../xmtp/XmtpConnectionSection';
import XmtpConversationStarter from '../xmtp/XmtpConversationStarter';
import XmtpConversation from '../xmtp/XmtpConversation';
import ConversationList from '../xmtp/ConversationList';
import { getConversations, deleteConversation } from '@/services/xmtpService';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useEfpStats, EfpPerson } from '@/hooks/useEfpStats';

const XmtpMessageModal: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [conversationToDelete, setConversationToDelete] = useState<any>(null);
  const { toast } = useToast();
  const { friends = [] } = useEfpStats(localStorage.getItem('connectedWalletAddress') || undefined);

  const handleConnect = async (client: any) => {
    setXmtpClient(client);
    setIsConnected(true);
    
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

  const confirmDeleteConversation = (conversation: any) => {
    setConversationToDelete(conversation);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConversation = async () => {
    if (!conversationToDelete) return;

    setIsLoading(true);
    try {
      await deleteConversation(xmtpClient, conversationToDelete);
      
      setConversations(prev => 
        prev.filter(c => c.peerAddress !== conversationToDelete.peerAddress)
      );
      
      if (currentConversation?.peerAddress === conversationToDelete.peerAddress) {
        setCurrentConversation(null);
      }

      toast({
        title: "Conversation deleted",
        description: "The conversation has been permanently deleted",
      });
    } catch (error) {
      console.error("Error deleting conversation:", error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    } finally {
      setDeleteDialogOpen(false);
      setConversationToDelete(null);
      setIsLoading(false);
    }
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
                <div className="p-2 border-b flex justify-between items-center">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={backToConversations}
                    className="pl-1"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    Back
                  </Button>
                  
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => confirmDeleteConversation(currentConversation)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Delete Chat
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
              <div className="p-4 space-y-4 flex-1 overflow-hidden">
                <Button 
                  onClick={startNewConversation} 
                  className="w-full mb-2"
                  variant="outline"
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  New Conversation
                </Button>
                
                <Tabs defaultValue="conversations" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="conversations">
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Conversations
                    </TabsTrigger>
                    <TabsTrigger value="friends">
                      <Users className="h-4 w-4 mr-2" />
                      Friends
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="conversations" className="mt-2">
                    <div className="max-h-[480px] overflow-y-auto pr-1">
                      <ConversationList 
                        conversations={conversations}
                        onSelectConversation={handleSelectConversation}
                        onDeleteConversation={confirmDeleteConversation}
                        isLoading={isLoading}
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="friends" className="mt-2">
                    <div className="max-h-[480px] overflow-y-auto pr-1">
                      <FriendsList 
                        friends={friends}
                        xmtpClient={xmtpClient}
                        onConversationStarted={handleConversationStarted}
                        isLoading={isLoading}
                        setIsLoading={setIsLoading}
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}
          </div>
        )}
        
        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Delete Conversation</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this conversation? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setDeleteDialogOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleDeleteConversation}
                disabled={isLoading}
              >
                {isLoading ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </dialog>
  );
};

interface FriendsListProps {
  friends: EfpPerson[];
  xmtpClient: any;
  onConversationStarted: (conversation: any, messages: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const FriendsList: React.FC<FriendsListProps> = ({ 
  friends, 
  xmtpClient, 
  onConversationStarted,
  isLoading,
  setIsLoading
}) => {
  const { toast } = useToast();

  const startConversationWithFriend = async (friendAddress: string) => {
    if (!xmtpClient) return;

    setIsLoading(true);
    try {
      const { startNewConversation, getMessages } = await import('@/services/xmtpService');
      const conversation = await startNewConversation(xmtpClient, friendAddress);
      const messages = await getMessages(conversation);
      onConversationStarted(conversation, messages);
    } catch (error: any) {
      console.error("Error starting conversation:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!friends.length) {
    return (
      <div className="text-center p-6 border rounded-md bg-muted/30">
        <p className="text-lg font-medium text-gray-700">No friends found</p>
        <p className="text-sm text-muted-foreground mt-2">
          Connect with others to build your network
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {friends.map((friend, index) => (
        <div 
          key={index}
          className="p-3 border rounded-md hover:bg-accent transition-colors flex items-center gap-3"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base truncate">
              {friend.ensName || `${friend.address.substring(0, 6)}...${friend.address.substring(friend.address.length - 4)}`}
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => startConversationWithFriend(friend.address)}
            disabled={isLoading}
          >
            Message
          </Button>
        </div>
      ))}
    </div>
  );
};

export default XmtpMessageModal;
