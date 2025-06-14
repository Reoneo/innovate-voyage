
import React from 'react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const SecurityDialogContent: React.FC = () => {
  return (
    <>
      <DialogHeader className="border-b border-gray-200 pb-3">
        <DialogTitle className="flex items-center gap-2">
          <Shield className="h-6 w-6 text-purple-500" />
          Security Score Details
        </DialogTitle>
        <DialogDescription>
          Wallet security analysis.
        </DialogDescription>
      </DialogHeader>
      <div className="py-4">
        <Card>
            <CardContent className="pt-6 text-center text-muted-foreground">
                <p>A detailed security analysis feature is coming soon to help you better understand your wallet's risk profile.</p>
            </CardContent>
        </Card>
      </div>
    </>
  );
};

export default SecurityDialogContent;
