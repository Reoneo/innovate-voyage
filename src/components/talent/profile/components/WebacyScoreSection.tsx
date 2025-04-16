
import React, { useState } from 'react';
import { useWebacyScore } from '@/hooks/useWebacyScore';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Shield, AlertTriangle, Check, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface WebacyScoreSectionProps {
  walletAddress?: string;
}

const WebacyScoreSection: React.FC<WebacyScoreSectionProps> = ({ walletAddress }) => {
  const { score, approvals, profileData, loading, error } = useWebacyScore(walletAddress);
  const [showDetails, setShowDetails] = useState(false);

  if (!walletAddress || error) return null;

  // Calculate a normalized score out of 100
  const normalizedScore = score !== undefined ? Math.min(Math.max(score * 20, 0), 100) : 0;
  
  // Determine score level
  const getScoreLevel = () => {
    if (score === undefined) return { text: 'Unknown', color: 'bg-gray-400' };
    if (score >= 4) return { text: 'Excellent', color: 'bg-green-500' };
    if (score >= 3) return { text: 'Good', color: 'bg-blue-500' };
    if (score >= 2) return { text: 'Fair', color: 'bg-yellow-500' };
    return { text: 'Poor', color: 'bg-red-500' };
  };
  
  const scoreLevel = getScoreLevel();

  return (
    <>
      <Card onClick={() => setShowDetails(true)} style={{ cursor: 'pointer' }}>
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className="h-6 w-6 text-primary" />
              <CardTitle className="text-lg">Wallet Security Score</CardTitle>
            </div>
            <div className="flex items-center">
              <span className="text-lg font-bold mr-2">{score?.toFixed(1) || 'N/A'}/5</span>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center py-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">{scoreLevel.text}</span>
                <span className="text-sm">{approvals !== undefined ? `${approvals} contract approvals` : ''}</span>
              </div>
              <Progress value={normalizedScore} className="h-3" />
              
              {/* Quick security insights */}
              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {profileData?.firstTx && (
                  <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded-full">
                    <Check className="h-3 w-3 text-green-500" />
                    <span>Active since {new Date(profileData.firstTx * 1000).getFullYear()}</span>
                  </div>
                )}
                
                {approvals !== undefined && (
                  <div className={`flex items-center gap-1 px-2 py-1 rounded-full ${approvals > 5 ? 'bg-yellow-100' : 'bg-green-100'}`}>
                    {approvals > 5 ? (
                      <AlertTriangle className="h-3 w-3 text-yellow-600" />
                    ) : (
                      <Check className="h-3 w-3 text-green-600" />
                    )}
                    <span>{approvals > 5 ? 'Multiple approvals' : 'Few approvals'}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Wallet Security Score</DialogTitle>
          </DialogHeader>
          
          {loading ? (
            <div className="flex justify-center py-4">
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg">
                <h3 className="font-bold text-xl mb-2">Score: {score?.toFixed(1) || 'N/A'}/5</h3>
                <Progress value={normalizedScore} className="h-3 mb-3" />
                <p className="text-sm text-muted-foreground">
                  This score represents the overall security rating of this wallet based on transaction history and behavior.
                </p>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-medium">Security Insights:</h3>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-3 border rounded">
                    <div className="mt-0.5">
                      {approvals && approvals > 5 ? (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <Check className="h-5 w-5 text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">Contract Approvals</p>
                      <p className="text-sm text-muted-foreground">
                        {approvals !== undefined ? (
                          approvals > 5 
                            ? `This wallet has ${approvals} contract approvals, which may increase risk.` 
                            : `This wallet has only ${approvals} contract approvals, which is good for security.`
                        ) : 'No approval data available.'}
                      </p>
                    </div>
                  </div>
                  
                  {profileData?.firstTx && (
                    <div className="flex items-start gap-2 p-3 border rounded">
                      <div className="mt-0.5">
                        <Check className="h-5 w-5 text-green-500" />
                      </div>
                      <div>
                        <p className="font-medium">Wallet Age</p>
                        <p className="text-sm text-muted-foreground">
                          First transaction: {new Date(profileData.firstTx * 1000).toLocaleDateString()}
                          <br/>
                          Wallet has been active for {new Date().getFullYear() - new Date(profileData.firstTx * 1000).getFullYear()} years.
                        </p>
                      </div>
                    </div>
                  )}
                  
                  {profileData?.totalTransactions && (
                    <div className="flex items-start gap-2 p-3 border rounded">
                      <div className="mt-0.5">
                        <Info className="h-5 w-5 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-medium">Transaction History</p>
                        <p className="text-sm text-muted-foreground">
                          Total transactions: {profileData.totalTransactions}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-end">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => setShowDetails(false)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WebacyScoreSection;
