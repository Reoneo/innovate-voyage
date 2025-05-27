
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, SendHorizontal, Paperclip, Smile } from 'lucide-react';
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
    <form onSubmit={handleSendMessage} className="flex items-end gap-2">
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-10 w-10 flex-shrink-0"
        disabled={isLoading}
      >
        <Paperclip className="h-5 w-5 text-gray-500" />
      </Button>
      
      <Textarea
        value={messageContent}
        onChange={(e) => setMessageContent(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder="Type a message..."
        className="resize-none min-h-[50px] rounded-full px-4 py-2 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-gray-300"
      />
      
      <Button 
        type="button" 
        variant="ghost" 
        size="icon" 
        className="rounded-full h-10 w-10 flex-shrink-0"
        disabled={isLoading}
      >
        <Smile className="h-5 w-5 text-gray-500" />
      </Button>
      
      <Button 
        type="submit" 
        size="icon" 
        disabled={!messageContent.trim() || isLoading}
        className="rounded-full h-10 w-10 bg-blue-500 hover:bg-blue-600 flex-shrink-0"
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <SendHorizontal className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
};

export default XmtpMessageComposer;
