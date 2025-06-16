
import { Client } from '@xmtp/xmtp-js';
import { ethers } from 'ethers';
// Import Buffer polyfill
import { Buffer } from 'buffer';

// Make Buffer available globally if not already present
if (typeof window !== 'undefined') {
  window.Buffer = window.Buffer || Buffer;
  console.log("xmtpService: Buffer available:", !!window.Buffer);
  
  // Ensure global.Buffer is also set for libraries that use it
  // @ts-ignore - deliberately setting global object property
  if (typeof global === 'undefined') {
    // @ts-ignore - setting window.global
    window.global = window;
  }
  
  // @ts-ignore - ensure global.Buffer exists too
  if (window.global && !window.global.Buffer) {
    // @ts-ignore
    window.global.Buffer = window.Buffer;
  }
}

export const initXMTP = async () => {
  try {
    if (!window.ethereum) {
      throw new Error("No Ethereum provider found. Please install MetaMask.");
    }
    
    // Triple-check Buffer is available before we try to use XMTP
    if (!window.Buffer) {
      console.error("Buffer is not available, attempting to set it again");
      window.Buffer = Buffer;
      
      if (!window.Buffer) {
        throw new Error("Failed to initialize Buffer polyfill");
      }
    }
    
    console.log("XMTP initialization using Buffer:", !!window.Buffer);
    
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

/**
 * Check if a recipient can be messaged (is on the XMTP network)
 * @param client The XMTP client
 * @param addressOrName Recipient Ethereum address or ENS name
 * @returns Promise<boolean>
 */
export async function canMessage(client: any, addressOrName: string): Promise<boolean> {
  try {
    // If it's an ENS name, we need to first resolve it
    let address = addressOrName;
    if (addressOrName.includes('.') && !addressOrName.startsWith('0x')) {
      // This might be a Lens handle or other protocol as well
      if (addressOrName.endsWith('.lens')) {
        // Special handling for Lens protocol
        console.log(`Detected Lens handle: ${addressOrName}`);
        // For Lens handles, just use directly since XMTP can handle them
        return true;
      } 
      
      // For ENS names, resolve to address
      try {
        const provider = new ethers.JsonRpcProvider(
          "https://eth-mainnet.g.alchemy.com/v2/demo"
        );
        address = await provider.resolveName(addressOrName);
        if (!address) {
          console.log(`Could not resolve ${addressOrName} to an address`);
          return false;
        }
      } catch (error) {
        console.error(`Error resolving ${addressOrName}:`, error);
        // Continue with original input, some XMTP implementations may support direct handles
        address = addressOrName;
      }
    }
    
    // Check if the address is on the XMTP network
    const canMessageRecipient = await client.canMessage(address);
    return canMessageRecipient;
  } catch (error) {
    console.error("Error checking if can message:", error);
    return false;
  }
}

export const startNewConversation = async (client: Client, recipientAddress: string) => {
  try {
    // Special handling for Lens handles
    if (recipientAddress.endsWith('.lens')) {
      console.log(`Starting conversation with Lens handle: ${recipientAddress}`);
      // For Lens handles, we use them directly as XMTP can handle them
      return await client.conversations.newConversation(recipientAddress);
    }
    
    // For other addresses, check if they can be messaged
    const canMessageRecipient = await canMessage(client, recipientAddress);
    if (!canMessageRecipient) {
      throw new Error(`Recipient ${recipientAddress} is not on the XMTP network`);
    }
    
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

/**
 * Delete a message from a conversation 
 * @param conversation The XMTP conversation
 * @param messageId The ID of the message to delete
 * @returns Promise<void>
 */
export async function deleteMessage(conversation: any, messageId: string): Promise<void> {
  if (!conversation) {
    throw new Error("No conversation provided");
  }

  try {
    // For XMTP v11+, use the built-in delete method if available
    if (conversation.delete) {
      await conversation.delete(messageId);
    } else {
      // Fallback: Send a deletion message that clients can interpret
      // This is a workaround since actual deletion might not be available in all XMTP versions
      const deletionMessage = {
        messageType: "deletion",
        messageId: messageId,
        timestamp: new Date().toISOString()
      };
      
      await conversation.send(JSON.stringify(deletionMessage), {
        contentType: "application/json",
        contentFallback: `Message deleted`
      });
    }
  } catch (error) {
    console.error("Error deleting message:", error);
    throw error;
  }
}

/**
 * Delete an entire conversation
 * @param client The XMTP client
 * @param conversation The conversation to delete
 */
export async function deleteConversation(client: any, conversation: any): Promise<void> {
  if (!client || !conversation) {
    throw new Error("Client and conversation are required");
  }

  try {
    // Get all messages in the conversation
    const messages = await conversation.messages();
    
    // Mark conversation as deleted by sending a special message
    await conversation.send(JSON.stringify({
      messageType: "conversation_deleted",
      timestamp: new Date().toISOString()
    }), {
      contentType: "application/json",
      contentFallback: "This conversation has been deleted"
    });
    
    // Delete each message if the API supports it
    if (conversation.delete) {
      for (const message of messages) {
        try {
          await deleteMessage(conversation, message.id);
        } catch (error) {
          console.warn(`Failed to delete message ${message.id}`, error);
        }
      }
    }
    
    console.log(`Conversation with ${conversation.peerAddress} deleted`);
  } catch (error) {
    console.error("Error deleting conversation:", error);
    throw error;
  }
}
