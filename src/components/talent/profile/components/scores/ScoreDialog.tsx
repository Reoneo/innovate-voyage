
import React from 'react';
import { Star, ShieldAlert, SendHorizontal, ExternalLink } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { ScoreDialogProps } from './types';
import { getBuilderTitle, getThreatColor } from './utils/scoreUtils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const ScoreDialog: React.FC<ScoreDialogProps> = ({ open, onOpenChange, type, data }) => {
  const { score, webacyData, txCount, walletAddress } = data;

  const renderDialogContent = () => {
    switch (type) {
      case 'talent':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Star className="h-5 w-5 text-yellow-500" />
                Talent Protocol Score
              </DialogTitle>
              <DialogDescription>
                Builder progression and activity metrics
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Builder Score</h3>
                    <span className="text-xl font-bold text-yellow-500">
                      {score ?? 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p className="mb-2">Current Level: {score ? getBuilderTitle(score) : 'Unknown'}</p>
                    <a 
                      href={`https://talentprotocol.com/profile/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Talent Protocol →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );

      case 'webacy':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <ShieldAlert className={`h-5 w-5 ${getThreatColor(webacyData?.threatLevel)}`} />
                Security Analysis
              </DialogTitle>
              <DialogDescription>
                Wallet security metrics by Webacy
              </DialogDescription>
            </DialogHeader>
            
            <Tabs defaultValue="risk" className="mt-4">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="risk">Risk Score</TabsTrigger>
                <TabsTrigger value="transactions">Transactions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="risk" className="space-y-4">
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
              </TabsContent>
              
              <TabsContent value="transactions">
                <Card>
                  <CardContent className="pt-6">
                    <h3 className="font-medium mb-4">Security Transactions</h3>
                    <div className="space-y-3 max-h-[300px] overflow-y-auto">
                      {/* This would typically come from the Webacy API */}
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="p-3 border rounded-md">
                          <div className="flex justify-between items-center">
                            <span className={`px-2 py-1 rounded text-xs ${i === 1 ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>
                              {i === 1 ? 'High Risk' : 'Medium Risk'}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date().toLocaleDateString()}
                            </span>
                          </div>
                          <p className="mt-2 text-sm">
                            {i === 1 ? 'Unlimited token approval' : i === 2 ? 'Interaction with flagged contract' : 'Suspicious token transfer'}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex justify-end">
                      <Button 
                        variant="outline" 
                        className="flex items-center gap-1 text-sm"
                        asChild
                      >
                        <a 
                          href={`https://app.webacy.com/wallet/${webacyData?.walletAddress || ''}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View detailed analysis <ExternalLink size={12} />
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </>
        );

      case 'transactions':
        return (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <SendHorizontal className="h-5 w-5 text-blue-500" />
                Transaction History
              </DialogTitle>
              <DialogDescription>
                Historical transaction data
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-medium">Total Transactions</h3>
                    <span className="text-xl font-bold text-blue-500">
                      {txCount ?? 'N/A'}
                    </span>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <a 
                      href={`https://etherscan.io/address/${walletAddress}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View on Etherscan →
                    </a>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {renderDialogContent()}
      </DialogContent>
    </Dialog>
  );
};

export default ScoreDialog;
