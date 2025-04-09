
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import XmtpConnectionSection from '../xmtp/XmtpConnectionSection';
import XmtpConversationStarter from '../xmtp/XmtpConversationStarter';
import XmtpConversation from '../xmtp/XmtpConversation';

const XmtpMessageModal: React.FC = () => {
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [xmtpClient, setXmtpClient] = useState<any>(null);

  const handleConnect = (client: any) => {
    setXmtpClient(client);
    setIsConnected(true);
  };

  const handleConversationStarted = (conversation: any, existingMessages: any[]) => {
    setCurrentConversation(conversation);
    setMessages(existingMessages);
  };

  const closeModal = () => {
    if (window.xmtpMessageModal) {
      window.xmtpMessageModal.close();
    }
  };

  return (
    <dialog id="xmtpMessageModal" className="modal backdrop:bg-black/50 backdrop:backdrop-blur-sm rounded-lg shadow-xl p-0 w-[90%] max-w-md">
      <div className="bg-background p-6 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">XMTP Messaging</h3>
          <Button variant="ghost" size="icon" onClick={closeModal}>
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
            {!currentConversation ? (
              <XmtpConversationStarter
                xmtpClient={xmtpClient}
                onConversationStarted={handleConversationStarted}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            ) : (
              <XmtpConversation
                conversation={currentConversation}
                messages={messages}
                setMessages={setMessages}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
              />
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default XmtpMessageModal;
