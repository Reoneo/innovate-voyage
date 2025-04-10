
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, SendHorizonal } from 'lucide-react';
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
  const [messageContent, setMessageContent] = useState('');

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageContent.trim() || isLoading) return;
    
    setIsLoading(true);
    try {
      const sentMessage = await sendMessage(conversation, messageContent.trim());
      onMessageSent(sentMessage);
      setMessageContent('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Enter key to send message (Shift+Enter for new line)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <form onSubmit={handleSendMessage} className="flex gap-2 items-end">
      <Textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="resize-none min-h-[60px] h-[60px]"
      />
      <Button 
        type="submit" 
        size="icon" 
        disabled={!messageContent.trim() || isLoading}
        className="h-[60px]"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizonal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};

export default XmtpMessageComposer;
