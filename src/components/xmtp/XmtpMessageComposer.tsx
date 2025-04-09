
import React, { useState } from 'react';
import { Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { sendMessage } from '@/services/xmtpService';

interface XmtpMessageComposerProps {
  conversation: any;
  onMessageSent: (message: any) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const XmtpMessageComposer: React.FC<XmtpMessageComposerProps> = ({
  conversation,
  onMessageSent,
  isLoading,
  setIsLoading
}) => {
  const [message, setMessage] = useState('');
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim() || !conversation) return;
    
    setIsLoading(true);
    try {
      await sendMessage(conversation, message);
      
      // Add message to UI
      const newMessage = {
        content: message,
        senderAddress: window.connectedWalletAddress,
        sent: new Date()
      };
      
      onMessageSent(newMessage);
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

  return (
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
  );
};

export default XmtpMessageComposer;
