
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import TalentScoreDialogContent from "./dialogs/TalentScoreDialogContent";
import ActivityDialogContent from "./dialogs/ActivityDialogContent";
import BlockchainDialogContent from "./dialogs/BlockchainDialogContent";
import type { ScoreDialogData, DialogType } from "./types";

interface ScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: DialogType;
  data: ScoreDialogData;
}

const ScoreDialog: React.FC<ScoreDialogProps> = ({
  open,
  onOpenChange,
  type,
  data
}) => {
  const getDialogContent = () => {
    switch (type) {
      case "talent":
        return (
          <TalentScoreDialogContent
            score={data.score}
            walletAddress={data.walletAddress}
          />
        );
      case "activity":
        return (
          <ActivityDialogContent
            txCount={data.txCount}
            walletAddress={data.walletAddress}
          />
        );
      case "blockchain":
        return (
          <BlockchainDialogContent walletAddress={data.walletAddress} />
        );
      default:
        return null;
    }
  };

  const getDialogTitle = () => {
    switch (type) {
      case "talent":
        return "Builder Score Details";
      case "activity":
        return "Activity Details";
      case "blockchain":
        return "Blockchain Activity Details";
      default:
        return "";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-screen-lg w-full max-h-[98vh] overflow-y-auto p-0 bg-transparent shadow-none border-0">
        {getDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
