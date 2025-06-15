
import React from 'react';
import { ConnectButton } from '@rainbow-me/rainbowkit';

const WalletConnectButton: React.FC = () => {
  return (
    <div className="flex justify-center sm:justify-end">
      <ConnectButton.Custom>
        {({
          account,
          chain,
          openAccountModal,
          openChainModal,
          openConnectModal,
          authenticationStatus,
          mounted,
        }) => {
          const ready = mounted && authenticationStatus !== 'loading';
          const connected =
            ready &&
            account &&
            chain &&
            (!authenticationStatus ||
              authenticationStatus === 'authenticated');

          return (
            <div
              {...(!ready && {
                'aria-hidden': true,
                style: {
                  opacity: 0,
                  pointerEvents: 'none',
                  userSelect: 'none',
                },
              })}
            >
              {(() => {
                if (!connected) {
                  return (
                    <button
                      onClick={openConnectModal}
                      type="button"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      Connect Wallet
                    </button>
                  );
                }

                if (chain.unsupported) {
                  return (
                    <button
                      onClick={openChainModal}
                      type="button"
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground px-4 py-2 rounded-md font-medium transition-colors"
                    >
                      Wrong Network
                    </button>
                  );
                }

                return (
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
                    <button
                      onClick={openChainModal}
                      className="flex items-center justify-center sm:justify-start bg-secondary hover:bg-secondary/80 text-secondary-foreground px-3 py-2 rounded-md font-medium transition-colors"
                      type="button"
                    >
                      {chain.hasIcon && (
                        <div
                          className="w-4 h-4 rounded-full overflow-hidden mr-2 flex-shrink-0"
                          style={{ background: chain.iconBackground }}
                        >
                          {chain.iconUrl && (
                            <img
                              alt={chain.name ?? 'Chain icon'}
                              src={chain.iconUrl}
                              className="w-4 h-4"
                            />
                          )}
                        </div>
                      )}
                      <span className="truncate">{chain.name}</span>
                    </button>

                    <button
                      onClick={openAccountModal}
                      type="button"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground px-3 py-2 rounded-md font-medium transition-colors truncate"
                    >
                      <span className="block sm:hidden">
                        {account.displayName}
                      </span>
                      <span className="hidden sm:block">
                        {account.displayName}
                        {account.displayBalance ? ` (${account.displayBalance})` : ''}
                      </span>
                    </button>
                  </div>
                );
              })()}
            </div>
          );
        }}
      </ConnectButton.Custom>
    </div>
  );
};

export default WalletConnectButton;
