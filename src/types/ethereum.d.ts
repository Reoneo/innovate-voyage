declare namespace NodeJS {
  interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    PUBLIC_URL: string;
    REACT_APP_API_URL: string;
    REACT_APP_ALCHEMY_API_KEY: string;
    REACT_APP_INFURA_API_KEY: string;
    REACT_APP_ETHERSCAN_API_KEY: string;
    REACT_APP_OPENSEA_API_KEY: string;
    REACT_APP_WEBACY_API_KEY: string;
    REACT_APP_TALLY_API_KEY: string;
  }
}

interface Window {
  ethereum?: any;
  web3?: any;
  connectedWalletAddress?: string | null;
  connectWalletModal?: any;
  xmtpMessageModal?: any;
}

interface EthereumEvent {
  connect: { chainId: string };
  disconnect: Error;
  accountsChanged: string[];
  chainChanged: string;
  message: { type: string; data: unknown };
}

type EthereumEventKeys = keyof EthereumEvent;
type EthereumEventHandler<K extends EthereumEventKeys> = (
  event: EthereumEvent[K]
) => void;

interface Ethereum {
  isMetaMask?: boolean;
  on<K extends EthereumEventKeys>(
    eventName: K,
    handler: EthereumEventHandler<K>
  ): void;
  removeListener<K extends EthereumEventKeys>(
    eventName: K,
    handler: EthereumEventHandler<K>
  ): void;
  request: (request: {
    method: string;
    params?: Array<any>;
  }) => Promise<any>;
  selectedAddress: string | undefined;
}

interface EthereumProvider {
  isMetaMask?: boolean;
  once(eventName: string | symbol, listener: (...args: any[]) => void): this;
  on(eventName: string | symbol, listener: (...args: any[]) => void): this;
  off(eventName: string | symbol, listener: (...args: any[]) => void): this;
  addListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeListener(eventName: string | symbol, listener: (...args: any[]) => void): this;
  removeAllListeners(event?: string | symbol): this;
}

interface RequestArguments {
  method: string;
  params?: unknown[] | object;
}

interface ConnectInfo {
  chainId: string;
}

interface ProviderRpcError extends Error {
  message: string;
  code: number;
  data?: unknown;
}

interface ProviderMessage {
  type: string;
  data: unknown;
}

interface EthereumProvider {
  request(args: RequestArguments): Promise<unknown>;
  on(eventName: 'connect', listener: (connectInfo: ConnectInfo) => void): this;
  on(eventName: 'disconnect', listener: (error: ProviderRpcError) => void): this;
  on(eventName: 'chainChanged', listener: (chainId: string) => void): this;
  on(eventName: 'accountsChanged', listener: (accounts: string[]) => void): this;
  on(eventName: 'message', listener: (message: ProviderMessage) => void): this;
}
