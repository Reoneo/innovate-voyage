
import { useState } from 'react';
import { Client } from '@xmtp/xmtp-js';
import { initXMTP, sendMessage as xmtpSendMessage } from '@/services/xmtpService';

export const useXmtp = () => {
  const [client, setClient] = useState<Client | null>(null);

  const connect = async () => {
    try {
      const xmtpClient = await initXMTP();
      setClient(xmtpClient);
      return xmtpClient;
    } catch (error) {
      console.error("XMTP Connection Error:", error);
      throw error;
    }
  };

  const sendMessage = async (conversation: any, content: string) => {
    if (!client) {
      throw new Error("XMTP client not initialized");
    }
    return await xmtpSendMessage(conversation, content);
  };

  return { 
    client, 
    connect, 
    sendMessage 
  };
};
