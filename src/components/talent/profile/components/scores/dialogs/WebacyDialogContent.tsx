
import React from 'react';
import { Shield } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import type { WebacyData } from '../types';

// This matches the NFT dialog: summary section left, description/details right
interface WebacyDialogContentProps {
  webacyData: WebacyData | null;
}

const WebacyDialogContent: React.FC<WebacyDialogContentProps> = ({ webacyData }) => {
  return (
    <div className="max-w-3xl mx-auto bg-white text-gray-900 rounded-2xl overflow-hidden shadow border border-gray-200 p-0">
      <div className="grid grid-cols-1 md:grid-cols-2 min-h-[320px]">
        {/* Left: summary/visual */}
        <div className="flex flex-col items-center justify-center bg-gradient-to-br from-[#f5fbf6] via-[#f3f8fb] to-[#f2f4fa] p-8 md:border-r border-gray-100">
          <Shield className="h-14 w-14 text-green-600 mb-4" />
          <div className="text-xl font-semibold text-green-800 mb-2">Security Score</div>
          <div className="text-5xl font-bold text-green-700 mb-2">{webacyData?.riskScore ?? 'N/A'}</div>
          <div className="text-base font-medium text-muted-foreground">
            {webacyData?.riskScore ? webacyData.riskLabel : 'Unknown'}
          </div>
          <div className="mt-6 text-xs text-gray-400">Powered by Webacy</div>
        </div>
        {/* Right: details/explanation */}
        <div className="flex flex-col justify-center p-8 space-y-6">
          <div>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-2xl">
                Security Analysis
              </DialogTitle>
              <DialogDescription>
                Powered by Webacy Security Intelligence
              </DialogDescription>
            </DialogHeader>
          </div>
          <div>
            <h3 className="font-medium mb-2">About Security Score</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              The Security Score is provided by Webacy and summarizes your risk based on smart contracts, approvals, wallet activity, and threat levels seen on the blockchain. 
              <br />A higher score indicates safer wallets, while a lower one suggests more risk exposure.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default WebacyDialogContent;
