
import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { startNewConversation, getMessages, canMessage } from '@/services/xmtpService';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
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
    setErrorMessage(null);
    
    try {
      // First check if the recipient is on the XMTP network
      const canMessageRecipient = await canMessage(xmtpClient, recipient);
      
      if (!canMessageRecipient) {
        setErrorMessage(`Address ${recipient.substring(0, 6)}...${recipient.substring(38)} is not on the XMTP network yet`);
        throw new Error(`Recipient ${recipient} is not on the XMTP network`);
      }
      
      const conversation = await startNewConversation(xmtpClient, recipient);
      
      // Load existing messages
      const existingMessages = await getMessages(conversation);
      
      onConversationStarted(conversation, existingMessages);
      
      toast({
        title: "Conversation Started",
        description: `You can now message ${recipient.substring(0, 6)}...${recipient.substring(38)}`,
      });
    } catch (error: any) {
      // Don't show toast for the XMTP network error since we're displaying it in the UI
      if (!error.message.includes('not on the XMTP network')) {
        toast({
          title: "Error",
          description: error.message || "Failed to start conversation",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Recipient Address</label>
        <Input
          type="text"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
          placeholder="0x..."
          className="w-full"
        />
      </div>
      
      {errorMessage && (
        <Alert variant="destructive" className="my-2">
          <AlertDescription>
            {errorMessage}
            <p className="text-xs mt-1">
              The recipient must have used XMTP at least once to receive messages.
            </p>
          </AlertDescription>
        </Alert>
      )}
      
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
