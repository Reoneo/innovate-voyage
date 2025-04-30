
import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@xmtp/xmtp-js';
import XmtpConnectionSection from '../xmtp/XmtpConnectionSection';
import XmtpConversation from '../xmtp/XmtpConversation';
import ConversationList from '../xmtp/ConversationList';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';

interface XmtpMessageModalProps {
  address?: string;
}

const XmtpMessageModal: React.FC<XmtpMessageModalProps> = ({ address }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [xmtpClient, setXmtpClient] = useState<Client | null>(null);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(null);
  const modalRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    // Expose the modal to the global window object
    if (modalRef.current) {
      // @ts-ignore
      window.xmtpMessageModal = modalRef.current;
    }

    // Clean up on unmount
    return () => {
      // @ts-ignore
      window.xmtpMessageModal = undefined;
    };
  }, []);

  // Reset selected conversation when closing modal
  useEffect(() => {
    if (!isOpen) {
      setSelectedConversation(null);
    }
  }, [isOpen]);

  const handleConnectSuccess = (client: Client) => {
    setXmtpClient(client);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (modalRef.current) {
      modalRef.current.close();
    }
  };

  // Instead of using the traditional <dialog> element, use shadcn Dialog
  return (
    <>
      <dialog 
        ref={modalRef} 
        className="hidden"
        onClose={() => setIsOpen(false)}
        onClick={(e) => {
          if (e.target === modalRef.current) {
            closeModal();
          }
        }}
      />
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[85vh] p-0 overflow-hidden">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-2">
              <img 
                src="https://d392zik6ho62y0.cloudfront.net/images/xmtp-logo.png"
                alt="XMTP"
                className="w-8 h-8 object-contain"
              />
              <span>XMTP Messaging</span>
            </DialogTitle>
          </DialogHeader>
          
          {!xmtpClient ? (
            <div className="p-6">
              <div className="flex items-center mb-6">
                <img 
                  src="https://d392zik6ho62y0.cloudfront.net/images/xmtp-logo.png"
                  alt="XMTP"
                  className="w-12 h-12 mr-4 object-contain"
                />
                <div>
                  <h2 className="text-lg font-semibold">Connect to XMTP</h2>
                  <p className="text-gray-600 text-sm">
                    XMTP is the largest &amp; most secure decentralized messaging network
                  </p>
                </div>
              </div>
              <XmtpConnectionSection 
                walletAddress={address} 
                onClientCreated={handleConnectSuccess}
              />
            </div>
          ) : selectedConversation ? (
            <XmtpConversation 
              client={xmtpClient} 
              conversation={selectedConversation}
              onBack={() => setSelectedConversation(null)}
            />
          ) : (
            <div className="h-[70vh] overflow-hidden flex flex-col">
              <ConversationList 
                client={xmtpClient} 
                onSelectConversation={setSelectedConversation}
                className="flex-grow overflow-auto"
              />
              <div className="p-4 border-t bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Connected as {xmtpClient.address?.substring(0, 6)}...{xmtpClient.address?.substring(38)}
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      setXmtpClient(null);
                    }}
                  >
                    Disconnect
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default XmtpMessageModal;
