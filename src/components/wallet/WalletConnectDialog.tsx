
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WalletConnectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const WalletConnectDialog: React.FC<WalletConnectDialogProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 gap-0 border-0 rounded-2xl overflow-hidden max-w-md">
        <div className="p-6 bg-white">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold">Connect a Wallet</h2>
            <button 
              onClick={() => onOpenChange(false)} 
              className="rounded-full bg-gray-100 p-2 hover:bg-gray-200 transition-colors"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>

          <div className="grid grid-cols-5 gap-4">
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-white rounded-xl shadow-md p-3 w-16 h-16 flex items-center justify-center">
                <img src="/public/metamask-fox.svg" alt="MetaMask" className="h-12 w-12" />
              </div>
              <span className="text-sm font-medium">MetaMask</span>
              <span className="text-xs text-blue-500">Recent</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-blue-500 rounded-xl shadow-md p-3 w-16 h-16 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 25L25 7M7 7L25 25" stroke="white" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </div>
              <span className="text-sm font-medium">Zerion</span>
              <span className="text-xs text-transparent">.</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-black rounded-xl shadow-md p-3 w-16 h-16 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="8" y="8" width="6" height="6" fill="white" />
                  <rect x="18" y="8" width="6" height="6" fill="white" />
                  <rect x="8" y="18" width="6" height="6" fill="white" />
                  <rect x="18" y="18" width="6" height="6" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-medium">OKX</span>
              <span className="text-sm font-medium">Wallet</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-blue-500 rounded-xl shadow-md p-3 w-16 h-16 flex items-center justify-center">
                <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect x="12" y="12" width="8" height="8" fill="white" />
                </svg>
              </div>
              <span className="text-sm font-medium">Coinbase</span>
              <span className="text-xs text-transparent">.</span>
            </div>
            
            <div className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-blue-900 to-blue-600 rounded-xl shadow-md p-3 w-16 h-16 flex items-center justify-center">
                <div className="w-8 h-8 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 rounded-full" />
              </div>
              <span className="text-sm font-medium">Rainbow</span>
              <span className="text-xs text-transparent">.</span>
            </div>
          </div>
        </div>
        
        <div className="p-6 bg-white border-t border-gray-100">
          <h3 className="text-xl font-bold text-center mb-4">What is a Wallet?</h3>
          <p className="text-gray-500 text-center mb-6">
            A wallet is used to send, receive, store, and display digital 
            assets. It's also a new way to log in, without needing to 
            create new accounts and passwords on every website.
          </p>
          
          <div className="flex justify-center gap-4">
            <Button variant="outline" size="lg" className="rounded-full border-blue-500 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
              Get a Wallet
            </Button>
            <Button variant="outline" size="lg" className="rounded-full border-blue-500 text-blue-500 hover:text-blue-600 hover:bg-blue-50">
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletConnectDialog;
