
import React from "react";
import { DialogHeader, DialogTitle, DialogDescription, DialogClose } from "@/components/ui/dialog";
import { getBuilderTitle } from "../utils/scoreUtils";
import { Skeleton } from "@/components/ui/skeleton";
import { X, BarChart, CheckCircle } from "lucide-react";
import { useTalentProtocolSkills } from "../../../components/skills/useTalentProtocolSkills";

interface TalentScoreDialogContentProps {
  score: number | null;
  walletAddress: string;
}

const TalentScoreDialogContent: React.FC<TalentScoreDialogContentProps> = ({
  score,
  walletAddress
}) => {
  const { credentialSkills, talentScore, isLoading } = useTalentProtocolSkills(walletAddress);

  return (
    <div className="relative w-full h-[96vh] max-w-4xl mx-auto flex flex-col bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <DialogClose asChild>
        <button className="absolute top-4 right-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground z-50">
          <X className="h-6 w-6" />
          <span className="sr-only">Close</span>
        </button>
      </DialogClose>
      <div className="flex flex-col h-full">
        {/* Top Side: Visual/summary */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f7f7ff] via-[#f6f2fb] to-[#eceafe] p-8 border-b border-gray-100">
          <img
            src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/40d7073c-ed54-450e-874c-6e2255570950/logomark_dark.jpg?table=block&id=403db4f5-f028-4827-b704-35095d3bdd15&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1749456000000&signature=wVpMGWARK-VoESebvUStRy5M3WSFWM1ky_PBwsJR4tU&downloadName=logomark_dark.jpg"
            alt="Talent Protocol"
            className="h-16 w-16 mb-4 rounded-full border border-primary/30 shadow"
          />
          <div className="text-xl font-semibold text-primary mb-2">
            Builder Score
          </div>
          <div className="text-6xl font-bold text-indigo-700 mb-1">
            {talentScore ?? score ?? "N/A"}
          </div>
          <div className="text-base font-medium text-muted-foreground">
            Level: {talentScore ? getBuilderTitle(talentScore) : (score ? getBuilderTitle(score) : "Unknown")}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Wallet: {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
          </div>
        </div>
        {/* Bottom Side: Description/details */}
        <div className="flex-1 flex flex-col p-8 space-y-6 overflow-y-auto">
          <DialogHeader className="text-left">
            <DialogTitle className="flex items-center gap-2 text-2xl">
              <BarChart className="h-6 w-6 text-indigo-500" />
              Talent Protocol Credentials
            </DialogTitle>
            <DialogDescription>
              A detailed breakdown of your onchain credentials and skills from Talent Protocol.
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="space-y-4 pt-4">
                <Skeleton className="h-12 w-3/4 rounded-lg" />
                <Skeleton className="h-12 w-1/2 rounded-lg" />
                <Skeleton className="h-12 w-2/3 rounded-lg" />
            </div>
          ) : credentialSkills.length > 0 ? (
            <div className="space-y-3">
              <ul className="space-y-3">
                {credentialSkills.map((skill, index) => (
                  <li key={index} className="flex items-start gap-3 p-3 bg-gray-50/70 hover:bg-gray-100/50 transition-colors duration-200 rounded-lg border border-gray-200/80">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-800">{skill}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          ) : (
            <div className="text-center py-10">
                <p className="text-muted-foreground">No detailed credentials found on Talent Protocol for this wallet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalentScoreDialogContent;
