
import { ConnectButton } from '@rainbow-me/rainbowkit';
import React from 'react';

const RainbowWalletConnect: React.FC = () => {
  return (
    <div className="flex justify-center mb-4 sm:mb-6 md:mb-8">
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md">
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
                className="w-full"
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
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
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
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg px-4 py-2 sm:px-6 sm:py-3 md:px-8 md:py-4 text-sm sm:text-base transition-colors duration-200 shadow-lg hover:shadow-xl"
                      >
                        Wrong network
                      </button>
                    );
                  }

                  return (
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                      <button
                        onClick={openChainModal}
                        type="button"
                        className="flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-medium rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base transition-colors duration-200 flex-1 sm:flex-none"
                      >
                        {chain.hasIcon && (
                          <div
                            style={{
                              background: chain.iconBackground,
                              width: 20,
                              height: 20,
                              borderRadius: 999,
                              overflow: 'hidden',
                            }}
                          >
                            {chain.iconUrl && (
                              <img
                                alt={chain.name ?? 'Chain icon'}
                                src={chain.iconUrl}
                                style={{ width: 20, height: 20 }}
                              />
                            )}
                          </div>
                        )}
                        <span className="hidden sm:inline">{chain.name}</span>
                      </button>

                      <button
                        onClick={openAccountModal}
                        type="button"
                        className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base transition-colors duration-200 flex-1"
                      >
                        {account.ensAvatar && (
                          <img
                            alt={account.displayName}
                            src={account.ensAvatar}
                            className="w-5 h-5 rounded-full"
                          />
                        )}
                        <span className="truncate max-w-[120px] sm:max-w-[200px]">
                          {account.displayName}
                        </span>
                        <span className="hidden sm:inline text-xs opacity-75">
                          {account.displayBalance}
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
    </div>
  );
};

export default RainbowWalletConnect;
