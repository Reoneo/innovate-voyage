
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
// Import Buffer polyfill
import { Buffer } from 'buffer';

// Make Buffer available globally if not already present
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
}

export const initXMTP = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("No Ethereum provider found. Please install MetaMask.");
    }
    
    // Triple-check Buffer is available before we try to use XMTP
    if (!window.Buffer) {
      console.error("Buffer is not available, attempting to set it");
      window.Buffer = Buffer;
      
      if (!window.Buffer) {
        throw new Error("Failed to initialize Buffer polyfill");
      }
    }
    
    console.log("Using Buffer:", !!window.Buffer);
    
    const provider = new ethers.BrowserProvider(window.ethereum);
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    
    // Create the XMTP client
    const xmtp = await Client.create(signer);
    return xmtp;
  } catch (error) {
    console.error("Error initializing XMTP client:", error);
    throw error;
  }
};

export const getConversations = async (client: Client) => {
  try {
    return await client.conversations.list();
  } catch (error) {
    console.error("Error fetching conversations:", error);
    throw error;
  }
};

export const startNewConversation = async (client: Client, recipientAddress: string) => {
  try {
    return await client.conversations.newConversation(recipientAddress);
  } catch (error) {
    console.error(`Error starting conversation with ${recipientAddress}:`, error);
    throw error;
  }
};

export const sendMessage = async (conversation: any, content: string) => {
  try {
    return await conversation.send(content);
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
};

export const getMessages = async (conversation: any) => {
  try {
    return await conversation.messages();
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error;
  }
};

export const streamMessages = async (conversation: any, callback: (msg: any) => void) => {
  try {
    for await (const msg of await conversation.streamMessages()) {
      callback(msg);
    }
  } catch (error) {
    console.error("Error streaming messages:", error);
    throw error;
  }
};
