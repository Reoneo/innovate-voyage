
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScoreDialogProps {
  title: string;
  children: React.ReactNode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ScoreDialog: React.FC<ScoreDialogProps> = ({
  title,
  children,
  open,
  onOpenChange,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <div className="flex justify-between items-center pb-4 border-b">
          <DialogHeader>
            <DialogTitle className="text-lg font-medium">{title}</DialogTitle>
          </DialogHeader>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onOpenChange(false)}
            className="rounded-full h-8 w-8 text-gray-500 hover:text-gray-800 hover:bg-gray-100"
          >
            <X size={18} />
          </Button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
};
