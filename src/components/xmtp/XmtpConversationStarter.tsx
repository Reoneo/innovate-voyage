
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { startNewConversation, getMessages } from '@/services/xmtpService';

interface XmtpConversationStarterProps {
  xmtpClient: any;
  onConversationStarted: (conversation: any, messages: any[]) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const XmtpConversationStarter: React.FC<XmtpConversationStarterProps> = ({
  xmtpClient,
  onConversationStarted,
  isLoading,
  setIsLoading
}) => {
  const [recipient, setRecipient] = useState('');
  const { toast } = useToast();

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
      
      // Load existing messages
      const existingMessages = await getMessages(conversation);
      
      onConversationStarted(conversation, existingMessages);
      
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

  return (
    <div className="space-y-2">
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
    </div>
  );
};

export default XmtpConversationStarter;
