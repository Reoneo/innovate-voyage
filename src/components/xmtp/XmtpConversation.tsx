import React, { useState, useEffect, useRef } from 'react';
import { useEnsResolver } from '@/hooks/useEnsResolver';
import { useXmtp } from '@/hooks/useXmtp';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Send, Loader2 } from 'lucide-react';
import XmtpMessageList from './XmtpMessageList';

interface XmtpConversationProps {
  conversation: any;
}

const XmtpConversation: React.FC<XmtpConversationProps> = ({ conversation }) => {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const { client, sendMessage } = useXmtp();
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversation) return;
      setIsLoading(true);
      try {
        const msgs = await conversation.messages();
        setMessages(msgs);
      } catch (e) {
        console.error("Could not load messages", e)
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();

    // Subscribe to new messages
    let stream;
    if (conversation) {
      stream = conversation.streamMessages();
      stream.on('data', (message) => {
        setMessages(prevMessages => [...prevMessages, message]);
      });
    }

    return () => {
      stream?.off('data', () => {});
    };
  }, [conversation]);

  const handleSendMessage = async () => {
    if (!messageText.trim() || !conversation) return;

    setSending(true);
    try {
      await sendMessage(conversation, messageText);
      setMessages(prevMessages => [...prevMessages, {
        content: messageText,
        contentType: "text/plain",
        senderAddress: client?.address,
        timestamp: new Date()
      }]);
      setMessageText('');
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4">
        <XmtpMessageList messages={messages} isLoading={isLoading} />
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <div className="flex items-center">
          <Input
            type="text"
            placeholder="Type your message..."
            value={messageText}
            onChange={(e) => setMessageText(e.target.value)}
            className="flex-1 mr-2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />
          <Button onClick={handleSendMessage} disabled={sending}>
            {sending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending
              </>
            ) : (
              <>
                Send
                <Send className="ml-2 h-4 w-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default XmtpConversation;
