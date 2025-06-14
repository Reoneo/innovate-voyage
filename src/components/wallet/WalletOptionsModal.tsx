
import React from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface WalletOptionsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const wallets = [
  {
    id: "brave",
    label: "Brave Wallet",
    icon: "/lovable-uploads/f3ffae33-11b0-4cc8-ab34-82da2527d5f6.png", // Re-use uploaded asset for Brave for now
    recent: true,
  },
  {
    id: "para",
    label: "Sign in with Para",
    icon: "/lovable-uploads/f3ffae33-11b0-4cc8-ab34-82da2527d5f6.png",
    recent: false,
  },
  {
    id: "browser",
    label: "Browser Wallet",
    icon: "/lovable-uploads/f3ffae33-11b0-4cc8-ab34-82da2527d5f6.png",
    recent: false,
  },
  {
    id: "walletconnect",
    label: "WalletConnect",
    icon: "/lovable-uploads/f3ffae33-11b0-4cc8-ab34-82da2527d5f6.png",
    recent: false,
  },
  {
    id: "rainbow",
    label: "Rainbow",
    icon: "/lovable-uploads/f3ffae33-11b0-4cc8-ab34-82da2527d5f6.png",
    recent: false,
  },
];

const WalletOptionsModal: React.FC<WalletOptionsModalProps> = ({ open, onOpenChange }) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="rounded-2xl p-0 border-0 shadow-xl max-w-md w-[95vw]" style={{overflow: 'visible'}}>
        <div className="bg-gray-100 dark:bg-gray-900 rounded-t-2xl px-4 pt-6 pb-2 flex flex-col items-center justify-center relative">
          <button
            aria-label="Close"
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            onClick={() => onOpenChange(false)}
          >
            <X className="h-6 w-6"/>
          </button>
          <h2 className="text-lg font-semibold mb-3 text-center">Connect a Wallet</h2>
          <div className="flex flex-row gap-4 mb-1 mt-1 w-full justify-center max-w-full overflow-auto">
            {wallets.map((wallet) => (
              <div key={wallet.id} className="flex flex-col items-center min-w-[70px]">
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow w-14 h-14 flex items-center justify-center mb-1 border hover:shadow-md transition cursor-pointer">
                  <img src={wallet.icon} alt={wallet.label} className="h-9 w-9 object-contain" />
                </div>
                <span className="text-xs text-gray-800 dark:text-gray-50 font-medium text-center mt-1 leading-tight">
                  {wallet.label}
                  {wallet.recent && (
                    <span className="block text-primary text-[11px] mt-0.5">Recent</span>
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-b-2xl px-4 pb-6 pt-4 flex flex-col items-center text-center">
          <h3 className="font-semibold text-[1rem] mb-1 text-gray-800 dark:text-gray-100">What is a Wallet?</h3>
          <p className="text-gray-500 dark:text-gray-300 text-sm px-2 mb-4" style={{maxWidth: 300}}>
            A wallet is used to send, receive, store, and display digital assets. 
            It's also a new way to log in, without needing to create new accounts and passwords on every website.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="rounded-full border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 font-semibold min-w-[110px]">
              Get a Wallet
            </Button>
            <Button variant="outline" size="sm" className="rounded-full border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400 font-semibold min-w-[110px]">
              Learn More
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WalletOptionsModal;
