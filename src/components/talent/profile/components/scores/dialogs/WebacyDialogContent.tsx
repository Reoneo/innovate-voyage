
import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { Shield, AlertTriangle } from 'lucide-react';
import { ThreatLevel, WebacyData } from '../types';

interface WebacyDialogContentProps {
  webacyData: WebacyData | null;
}

const WebacyDialogContent: React.FC<WebacyDialogContentProps> = ({ webacyData }) => {
  if (!webacyData) {
    return (
      <div className="p-6 text-center">
        <Skeleton className="h-32 w-full mb-4" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  const getRiskDisplay = (threatLevel?: ThreatLevel) => {
    switch (threatLevel) {
      case 'LOW':
        return { 
          icon: <Shield className="h-6 w-6 text-green-500" />,
          color: 'text-green-500',
          text: 'Low Risk'
        };
      case 'MEDIUM':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-yellow-500" />,
          color: 'text-yellow-500',
          text: 'Medium Risk'
        };
      case 'HIGH':
        return {
          icon: <AlertTriangle className="h-6 w-6 text-red-500" />,
          color: 'text-red-500',
          text: 'High Risk'
        };
      default:
        return {
          icon: <Shield className="h-6 w-6 text-gray-500" />,
          color: 'text-gray-500',
          text: 'Unknown Risk'
        };
    }
  };

  const risk = getRiskDisplay(webacyData.threatLevel);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {risk.icon}
          <div>
            <h3 className={`text-xl font-bold ${risk.color}`}>
              {risk.text}
            </h3>
            <p className="text-sm text-muted-foreground">
              Security score: {webacyData.riskScore || 'Unknown'}
            </p>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Approvals</p>
            <p className="text-2xl font-semibold">
              {webacyData.approvals?.count || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Risky Approvals</p>
            <p className="text-2xl font-semibold text-yellow-600">
              {webacyData.approvals?.riskyCount || 0}
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Transactions</p>
            <p className="text-2xl font-semibold">
              {webacyData.quickProfile?.transactions || 0}
            </p>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-muted-foreground">Contracts</p>
            <p className="text-2xl font-semibold">
              {webacyData.quickProfile?.contracts || 0}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-6 text-center">
        <a 
          href={`https://app.webacy.com/wallet/${webacyData.walletAddress || ''}`}
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block bg-black text-white px-4 py-2 rounded text-sm hover:bg-gray-800 transition-colors"
        >
          View Complete Analysis
        </a>
      </div>
    </div>
  );
};

export default WebacyDialogContent;
