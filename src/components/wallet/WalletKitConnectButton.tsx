
import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Core } from "@walletconnect/core";
import { WalletKit } from "@reown/walletkit";

const PROJECT_ID = "34ced670384ce48a67442000a67f815e";

const metadata = {
  name: "Recruitment.box",
  description: "AppKit Example",
  url: "https://reown.com/appkit",
  icons: ["https://assets.reown.com/reown-profile-pic.png"],
};

export const WalletKitConnectButton: React.FC = () => {
  const handleConnect = useCallback(async () => {
    try {
      // Use a single core instance (no need to re-create every click in prod)
      const core = new Core({ projectId: PROJECT_ID });
      // Initialize WalletKit (performs singleton logic inside)
      const walletKit = await WalletKit.init({
        core,
        metadata,
      });
      // Show UI to connect wallet
      const session = await walletKit.connect();
      console.log("WalletKit session result:", session);
      alert("Wallet connected: " + session.accounts[0]);
    } catch (err: any) {
      console.error("WalletKit connect failed", err);
      alert("Failed to connect wallet: " + (err?.message ?? "Unknown error"));
    }
  }, []);

  return (
    <Button variant="outline" className="ml-4" onClick={handleConnect}>
      Connect with WalletKit
    </Button>
  );
};

export default WalletKitConnectButton;
