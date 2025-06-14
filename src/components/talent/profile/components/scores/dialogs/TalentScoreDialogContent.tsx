
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { getBuilderTitle } from "../utils/scoreUtils";
import { useBlockchainProfile } from "@/hooks/useEtherscan";
import { Skeleton } from "@/components/ui/skeleton";
import { BadgeDollarSign, X } from "lucide-react";

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({
  score,
  walletAddress
}) => {
  const { data: profile, isLoading } = useBlockchainProfile(walletAddress);

  return (
    <div className="relative w-full h-[96vh] max-w-4xl mx-auto flex flex-col justify-center bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <DialogClose asChild>
        <button className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </DialogClose>
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[420px]">
        {/* Left Side: Visual/summary */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f7ff] via-[#f6f2fb] to-[#eceafe] p-10 md:border-r border-gray-100">
          <img
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-16 w-16 mb-4 rounded-full border border-primary/30 shadow"
          />
          <div className="text-xl font-semibold text-primary mb-2">
            Builder Score
          </div>
          <div className="text-6xl font-bold text-indigo-700 mb-1">
            {score ?? "N/A"}
          </div>
          <div className="text-base font-medium text-muted-foreground">
            Level: {score ? getBuilderTitle(score) : "Unknown"}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
        {/* Right Side: Description/details */}
        <div className="flex flex-col justify-center p-10 space-y-8">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-2xl">
              Builder Score Details
            </DialogTitle>
            <DialogDescription>
              Your talent and contribution score based on onchain activity
            </DialogDescription>
          </DialogHeader>
          <div>
            <div className="mb-2">
              <h3 className="font-medium mb-2">What is Builder Score?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                The Builder Score reflects your onchain contributions, project involvement,
                and overall impact in the Web3 ecosystem. It is calculated based on
                factors like transaction history, smart contract interactions, and community participation.
              </p>
            </div>
            <div className="mt-6">
              {isLoading ? (
                <Skeleton className="w-40 h-5" />
              ) : profile ? (
                <div>
                  <BadgeDollarSign className="inline h-4 w-4 text-orange-400 mr-2 align-text-bottom" />
                  <span className="font-semibold">ETH Balance:</span>{" "}
                  <span>{profile.balance} ETH</span>
                  <span className="mx-4 font-semibold">Txns:</span>
                  <span>{profile.transactionCount}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">No extra blockchain data available.</span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TalentScoreDialogContent;
