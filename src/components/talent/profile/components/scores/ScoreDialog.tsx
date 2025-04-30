import React from 'react';
import { ShieldAlert, SendHorizontal, ExternalLink } from 'lucide-react';
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
                <img 
                  src="https://file.notion.so/f/f/16cd58fd-bb08-46b6-817c-f2fce5ebd03d/0b83e516-c3cb-4c3e-b00a-9d6a927898aa/Logo_TalentPassport.jpg?table=block&id=e47be4ed-acec-4839-a019-c20295bba22d&spaceId=16cd58fd-bb08-46b6-817c-f2fce5ebd03d&expirationTimestamp=1746043200000&signature=nhPbTdjNSmsIdiFDNE5oArkW94dSk4ezIhfnCVXR5yo&downloadName=Logo_TalentPassport.jpg" 
                  alt="Talent Passport" 
                  className="h-6"
                />
                Builder Score Details
              </DialogTitle>
              <DialogDescription>
                Builder progression and activity metrics
              </DialogDescription>
            </DialogHeader>
            
            <Card className="mt-4">
              <CardContent className="pt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium">Total Builder Score</h3>
                  <span className="text-xl font-bold text-yellow-500">
                    {score ?? 'N/A'}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mb-2">
                  <p>Current Level: {score ? getBuilderTitle(score) : 'Unknown'}</p>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3">Score Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Human Checkmark</span>
                      <span className="font-medium">20/20 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>GitHub</span>
                      <span className="font-medium">26/130 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Onchain Activity</span>
                      <span className="font-medium">24/48 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Talent Protocol</span>
                      <span className="font-medium">0/20 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>X/Twitter</span>
                      <span className="font-medium">4/4 pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <h4 className="font-medium mb-3">Other Platforms</h4>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex justify-between">
                      <span>Base</span>
                      <span className="font-medium">0/127 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Bountycaster</span>
                      <span className="font-medium">0/12 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>BUILD</span>
                      <span className="font-medium">0/20 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Crypto Nomads</span>
                      <span className="font-medium">0/12 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>DAOBase</span>
                      <span className="font-medium">0/8 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Developer DAO</span>
                      <span className="font-medium">0/20 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Devfolio</span>
                      <span className="font-medium">0/64 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ENS</span>
                      <span className="font-medium">0/6 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>ETHGlobal</span>
                      <span className="font-medium">0/106 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Farcaster</span>
                      <span className="font-medium">0/82 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Lens</span>
                      <span className="font-medium">0/6 pts</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Stack</span>
                      <span className="font-medium">0/12 pts</span>
                    </div>
                  </div>
                </div>
                
                <div className="mt-4">
                  <a 
                    href={`https://app.talentprotocol.com/profile/${walletAddress}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline flex items-center gap-1"
                  >
                    Verify on Talent Protocol <ExternalLink size={14} />
                  </a>
                </div>
              </CardContent>
            </Card>
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
                      {webacyData?.quickProfile?.transactions ? (
                        <div className="p-3 border rounded-md">
                          <div className="flex justify-between items-center">
                            <span className="px-2 py-1 rounded text-xs bg-blue-100 text-blue-800">
                              Transaction Stats
                            </span>
                          </div>
                          <div className="mt-2 text-sm space-y-2">
                            <p>Total Transactions: {webacyData.quickProfile.transactions}</p>
                            <p>Contract Interactions: {webacyData.quickProfile.contracts || 0}</p>
                          </div>
                        </div>
                      ) : (
                        <p className="text-center text-muted-foreground">No transaction data available</p>
                      )}
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
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      View on Etherscan <ExternalLink size={14} />
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
