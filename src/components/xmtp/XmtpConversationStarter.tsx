import React from 'react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { Loader2, Search } from 'lucide-react';
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
  const [inputValue, setInputValue] = useState('');
  const [recipient, setRecipient] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const { toast } = useToast();
  
  const { resolvedAddress, resolvedEns, isLoading: isResolvingEns } = useEnsResolver(inputValue);

  const handleLookupRecipient = () => {
    if (!inputValue.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid Ethereum address, ENS name, or Lens handle",
        variant: "destructive",
      });
      return;
    }
    
    if (inputValue.endsWith('.lens')) {
      setRecipient(inputValue);
      toast({
        title: "Lens Handle",
        description: `Using Lens handle: ${inputValue}`,
      });
      return;
    }
    
    if (resolvedAddress) {
      setRecipient(resolvedAddress);
      toast({
        title: "Address Resolved",
        description: resolvedEns ? `Resolved to ${resolvedEns}` : `Address is valid`,
      });
    } else if (!isResolvingEns) {
      if (inputValue.startsWith('0x') && inputValue.length === 42) {
        setRecipient(inputValue);
        toast({
          title: "Using Ethereum Address",
          description: `Address appears valid: ${inputValue.substring(0, 6)}...${inputValue.substring(38)}`,
        });
      } else {
        toast({
          title: "Resolution Failed",
          description: "Could not resolve the address, ENS name, or Lens handle",
          variant: "destructive",
        });
      }
    }
  };

  const handleStartConversation = async () => {
    if (!recipient) {
      toast({
        title: "Invalid Recipient",
        description: "Please enter and lookup a valid Ethereum address, ENS name, or Lens handle",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);
    
    try {
      const canMessageRecipient = await canMessage(xmtpClient, recipient);
      
      if (!canMessageRecipient) {
        const displayAddress = resolvedEns || (recipient.endsWith('.lens') ? recipient : 
          `${recipient.substring(0, 6)}...${recipient.substring(38)}`);
        setErrorMessage(`${displayAddress} is not on the XMTP network yet`);
        throw new Error(`Recipient ${recipient} is not on the XMTP network`);
      }
      
      const conversation = await startNewConversation(xmtpClient, recipient);
      
      const existingMessages = await getMessages(conversation);
      
      onConversationStarted(conversation, existingMessages);
      
      const displayAddress = resolvedEns || (recipient.endsWith('.lens') ? recipient : 
        `${recipient.substring(0, 6)}...${recipient.substring(38)}`);
      toast({
        title: "Conversation Started",
        description: `You can now message ${displayAddress}`,
      });
    } catch (error: any) {
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
        <label className="text-sm font-medium">Recipient Address, ENS or Lens Handle</label>
        <div className="flex gap-2">
          <Input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="0x... or name.eth or user.lens"
            className="flex-1"
            disabled={isLoading}
          />
          <Button 
            onClick={handleLookupRecipient} 
            variant="outline"
            disabled={isLoading || !inputValue.trim() || isResolvingEns}
          >
            {isResolvingEns ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
          </Button>
        </div>
        
        {resolvedAddress && (
          <div className="text-xs text-muted-foreground">
            {resolvedEns ? (
              <>ENS: {resolvedEns} → {resolvedAddress.substring(0, 6)}...{resolvedAddress.substring(38)}</>
            ) : (
              <>Address: {resolvedAddress.substring(0, 6)}...{resolvedAddress.substring(38)}</>
            )}
          </div>
        )}
        
        {inputValue.endsWith('.lens') && (
          <div className="text-xs text-purple-500">
            Lens Handle: {inputValue}
          </div>
        )}
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
