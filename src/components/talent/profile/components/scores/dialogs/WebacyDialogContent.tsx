
import React from 'react';
import { ExternalLink, ArrowUpRight } from 'lucide-react';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { WebacyData } from '../types';
import { getThreatColor } from '../utils/scoreUtils';

interface WebacyDialogContentProps {
  webacyData: WebacyData | null;
}

const WebacyDialogContent: React.FC<WebacyDialogContentProps> = ({ webacyData }) => {
  if (!webacyData) {
    return (
      <div className="py-6 px-4 text-center">
        <p>No security data available for this wallet.</p>
      </div>
    );
  }
  
  return (
    <div className="py-4 px-6">
      <div className="flex items-center gap-2 mb-4">
        <img 
          src="https://img.cryptorank.io/coins/webacy1675847088001.png" 
          alt="Webacy Logo" 
          className="h-8 w-8"
        />
        <div>
          <h2 className="text-xl font-bold flex items-center">
            Risk Score: {webacyData?.riskScore !== undefined ? webacyData.riskScore : '0.00'}
          </h2>
          <p className="text-sm text-gray-400">
            Wallet security analysis by Webacy
          </p>
        </div>
      </div>
      
      <Tabs defaultValue="risk-items" className="mt-4">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="risk-items">Risk Items</TabsTrigger>
          <TabsTrigger value="details">Details</TabsTrigger>
        </TabsList>
        
        <TabsContent value="risk-items">
          <RiskItemsSection webacyData={webacyData} />
        </TabsContent>
        
        <TabsContent value="details">
          <div className="space-y-4">
            <RiskScoreCard webacyData={webacyData} />
            <ApprovalCard webacyData={webacyData} />
            <TransactionsCard webacyData={webacyData} />
          </div>
        </TabsContent>
      </Tabs>
      
      <div className="mt-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          asChild
        >
          <a 
            href={`https://app.webacy.com/wallet/${webacyData?.walletAddress || ''}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ArrowUpRight size={16} /> Open in Webacy
          </a>
        </Button>
      </div>
    </div>
  );
};

interface CardProps {
  webacyData: WebacyData | null;
}

const RiskItemsSection: React.FC<CardProps> = ({ webacyData }) => {
  const riskItems = webacyData?.riskItems || [];
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">
          {riskItems.length} Risk {riskItems.length === 1 ? 'Item' : 'Items'}
        </h3>
        <div className="bg-gray-100 px-3 py-1 rounded-md flex items-center gap-2 text-sm">
          <span>Ethereum</span>
          <svg width="16" height="16" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 0 15 0C6.71573 0 0 6.71573 0 15C0 23.2843 6.71573 30 15 30Z" fill="#627EEA"/>
            <path d="M15.4678 3.75V12.0656L22.4953 15.2062L15.4678 3.75Z" fill="white" fillOpacity="0.602"/>
            <path d="M15.4678 3.75L8.4375 15.2062L15.4678 12.0656V3.75Z" fill="white"/>
            <path d="M15.4678 20.595V26.2453L22.5 16.5L15.4678 20.595Z" fill="white" fillOpacity="0.602"/>
            <path d="M15.4678 26.2453V20.5941L8.4375 16.5L15.4678 26.2453Z" fill="white"/>
            <path d="M15.4678 19.2872L22.4953 15.1912L15.4678 12.0675V19.2872Z" fill="white" fillOpacity="0.2"/>
            <path d="M8.4375 15.1912L15.4678 19.2872V12.0675L8.4375 15.1912Z" fill="white" fillOpacity="0.602"/>
          </svg>
        </div>
      </div>
      
      <div className="space-y-4 max-h-[300px] overflow-y-auto">
        {riskItems.length > 0 ? (
          riskItems.map((item, index) => (
            <div key={item.id || index} className="border border-gray-200 rounded-lg p-4 bg-white">
              <div className="flex items-start gap-3">
                <div className="rounded-full bg-red-100 p-2 flex-shrink-0">
                  <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M13.7125 5.81512C14.6681 4.22803 16.9323 4.18792 17.9386 5.73993L28.028 22.0358C29.0913 23.672 27.9164 25.8249 26.0101 25.8249H6.39486C4.51918 25.8249 3.33482 23.7327 4.35427 22.0915L13.7125 5.81512Z" fill="#E53935"/>
                    <path d="M16 11V17" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    <circle cx="16" cy="21" r="1.5" fill="white"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-lg">{item.label || 'Risk Item'}</h4>
                  <p className="text-sm text-gray-500 mb-2">From: {item.address ? item.address.substring(0, 8) + '...' + item.address.substring(item.address.length - 4) : 'Unknown'}</p>
                  <p className="text-sm text-gray-500">
                    {item.description || 'No description available'}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            No risk items found
          </div>
        )}
      </div>
    </div>
  );
};

const RiskScoreCard: React.FC<CardProps> = ({ webacyData }) => (
  <Card>
    <CardContent className="pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Risk Score</h3>
        <span className={`text-xl font-bold ${getThreatColor(webacyData?.threatLevel)}`}>
          {webacyData?.riskScore !== undefined ? webacyData.riskScore : 'Unknown'}
        </span>
      </div>
      <div className="text-sm text-muted-foreground">
        <p className="mb-2">
          The wallet has a {webacyData?.threatLevel?.toLowerCase() || 'unknown'} threat level.
          {webacyData?.threatLevel === 'LOW' && ' This indicates normal blockchain activity.'}
          {webacyData?.threatLevel === 'MEDIUM' && ' Some suspicious transactions were detected.'}
          {webacyData?.threatLevel === 'HIGH' && ' High-risk activity detected in this wallet.'}
        </p>
      </div>
    </CardContent>
  </Card>
);

const ApprovalCard: React.FC<CardProps> = ({ webacyData }) => (
  <Card>
    <CardContent className="pt-6">
      <h3 className="font-medium mb-4">Contract Approvals</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-semibold">
            {webacyData?.approvals?.count || 0}
          </span>
          <span className="text-sm text-muted-foreground">Total Approvals</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold text-amber-600">
            {webacyData?.approvals?.riskyCount || 0}
          </span>
          <span className="text-sm text-muted-foreground">Risky Approvals</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

const TransactionsCard: React.FC<CardProps> = ({ webacyData }) => (
  <Card>
    <CardContent className="pt-6">
      <h3 className="font-medium mb-4">Wallet Activity</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col">
          <span className="text-xl font-semibold">
            {webacyData?.quickProfile?.transactions || 0}
          </span>
          <span className="text-sm text-muted-foreground">Transactions</span>
        </div>
        <div className="flex flex-col">
          <span className="text-xl font-semibold">
            {webacyData?.quickProfile?.contracts || 0}
          </span>
          <span className="text-sm text-muted-foreground">Contract Interactions</span>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default WebacyDialogContent;
