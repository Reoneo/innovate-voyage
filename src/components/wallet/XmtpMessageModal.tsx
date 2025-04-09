
import React, { useState } from 'react';
import { X, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { 
  initXMTP, 
  startNewConversation, 
  sendMessage,
  getMessages
} from '@/services/xmtpService';

const XmtpMessageModal: React.FC = () => {
  const [recipient, setRecipient] = useState('');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [currentConversation, setCurrentConversation] = useState<any>(null);
  const [xmtpClient, setXmtpClient] = useState<any>(null);
  const { toast } = useToast();

  const connectToXMTP = async () => {
    setIsLoading(true);
    try {
      const client = await initXMTP();
      setXmtpClient(client);
      setIsConnected(true);
      toast({
        title: "XMTP Connected",
        description: "You are now connected to XMTP messaging",
      });
    } catch (error: any) {
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect to XMTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartConversation = async () => {
    if (!recipient.trim()) {
      toast({
        title: "Invalid Recipient",
        description: "Please enter a valid Ethereum address",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const conversation = await startNewConversation(xmtpClient, recipient);
      setCurrentConversation(conversation);
      
      // Load existing messages
      const existingMessages = await getMessages(conversation);
      setMessages(existingMessages);
      
      toast({
        title: "Conversation Started",
        description: `You can now message ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to start conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !currentConversation) return;
    
    setIsLoading(true);
    try {
      await sendMessage(currentConversation, message);
      
      // Add message to UI
      const newMessage = {
        content: message,
        senderAddress: window.connectedWalletAddress,
        sent: new Date()
      };
      
      setMessages(prev => [...prev, newMessage]);
      setMessage(''); // Clear input
      
      toast({
        title: "Message Sent",
        description: "Your message has been sent successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
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
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Connect to XMTP to start messaging other Ethereum accounts
            </p>
            <Button 
              className="w-full" 
              onClick={connectToXMTP}
              disabled={isLoading}
            >
              {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
              Connect to XMTP
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {!currentConversation ? (
              <>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Recipient Address</label>
                  <input
                    type="text"
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x..."
                    className="w-full p-2 border rounded-md"
                  />
                </div>
                <Button 
                  className="w-full" 
                  onClick={handleStartConversation}
                  disabled={isLoading || !recipient}
                >
                  {isLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                  Start Conversation
                </Button>
              </>
            ) : (
              <>
                <div className="h-60 overflow-y-auto border rounded-md p-3 space-y-2 bg-gray-50">
                  {messages.length === 0 ? (
                    <p className="text-center text-muted-foreground text-sm">No messages yet</p>
                  ) : (
                    messages.map((msg, idx) => (
                      <div 
                        key={idx} 
                        className={`p-2 rounded-lg max-w-[80%] ${
                          msg.senderAddress === window.connectedWalletAddress 
                            ? 'bg-primary text-primary-foreground ml-auto' 
                            : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        <p className="text-sm">{msg.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {new Date(msg.sent).toLocaleTimeString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
                <div className="flex space-x-2">
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="resize-none"
                  />
                  <Button 
                    size="icon" 
                    onClick={handleSendMessage}
                    disabled={isLoading || !message.trim()}
                  >
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </dialog>
  );
};

export default XmtpMessageModal;
