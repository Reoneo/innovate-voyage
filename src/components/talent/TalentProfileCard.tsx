
import React, { useState } from 'react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { HoverCard, HoverCardTrigger } from '@/components/ui/hover-card';
import { Shield, Award, Info, Star, ArrowDownUp, ExternalLink } from 'lucide-react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Button } from '@/components/ui/button';
import { truncateAddress, BlockchainPassport } from '@/lib/utils';
import UserCardTooltip from '@/components/jobs/UserCardTooltip';
import { useBlockchainProfile } from '@/hooks/useEtherscan';
import { Link } from 'react-router-dom';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useIsMobile } from '@/hooks/use-mobile';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface TalentProfileCardProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
    hasMoreSkills: boolean;
  };
}

const TalentProfileCard: React.FC<TalentProfileCardProps> = ({ passport }) => {
  const [showTransactions, setShowTransactions] = useState(false);
  const { data: blockchainProfile, isLoading } = useBlockchainProfile(passport.owner_address);
  const isMobile = useIsMobile();

  function formatTimeStamp(timestamp: string): string {
    const date = new Date(parseInt(timestamp) * 1000);
    return date.toLocaleDateString();
  }

  function formatEther(wei: string): string {
    const ether = parseFloat(wei) / 1e18;
    return ether.toFixed(4);
  }

  // Use Popover for mobile instead of HoverCard
  const InfoPopover = ({ children }: { children: React.ReactNode }) => {
    if (isMobile) {
      return (
        <Popover>
          <PopoverTrigger asChild>
            <div className="flex items-center gap-1 cursor-pointer">
              <Shield className={`h-4 w-4 ${passport.colorClass}`} />
              <span className={`font-bold ${passport.colorClass}`}>{passport.score}</span>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0">
            {children}
          </PopoverContent>
        </Popover>
      );
    }

    return (
      <HoverCard>
        <HoverCardTrigger asChild>
          <div className="flex items-center gap-1 cursor-help">
            <Shield className={`h-4 w-4 ${passport.colorClass}`} />
            <span className={`font-bold ${passport.colorClass}`}>{passport.score}</span>
          </div>
        </HoverCardTrigger>
        {children}
      </HoverCard>
    );
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center gap-4 pb-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src={passport.avatar_url || '/placeholder.svg'} alt={passport.passport_id} />
          <AvatarFallback>{passport.passport_id?.substring(0, 2) || 'BP'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm md:text-base truncate max-w-[150px] md:max-w-none">
              {passport.passport_id}
            </CardTitle>
            <InfoPopover>
              <UserCardTooltip passport={passport} />
            </InfoPopover>
          </div>
          <CardDescription className="truncate text-xs md:text-sm">
            {truncateAddress(passport.owner_address)}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <h4 className="text-sm font-medium flex items-center gap-1 mb-1">
            <Award className="h-4 w-4" /> Skills
          </h4>
          <div className="flex flex-wrap gap-1 mt-1">
            {passport.skills?.slice(0, isMobile ? 3 : 4).map((skill, idx) => (
              <Badge 
                key={`${skill.name}-${idx}`} 
                variant={skill.proof ? "default" : "secondary"} 
                className="text-xs"
              >
                {skill.proof && <Star className="h-3 w-3 mr-1" />}
                {skill.name}
              </Badge>
            ))}
            {passport.hasMoreSkills && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Badge variant="outline" className="text-xs cursor-help">
                      <Info className="h-3 w-3 mr-1" />
                      +{passport.skills.length - (isMobile ? 3 : 4)} more
                    </Badge>
                  </TooltipTrigger>
                  <TooltipContent className="w-64 p-2">
                    <p className="font-medium mb-1">Additional Skills:</p>
                    <div className="flex flex-wrap gap-1">
                      {passport.skills?.slice(isMobile ? 3 : 4).map((skill, idx) => (
                        <Badge 
                          key={`more-${skill.name}-${idx}`} 
                          variant={skill.proof ? "default" : "secondary"} 
                          className="text-xs"
                        >
                          {skill.proof && <Star className="h-3 w-3 mr-1" />}
                          {skill.name}
                        </Badge>
                      ))}
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
        <div className="text-xs text-muted-foreground mb-2">
          <span className="font-medium">Human Score:</span> {passport.category}
        </div>
        
        {/* Blockchain Transactions Section */}
        <div className="mt-2 pt-2 border-t border-border">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium flex items-center gap-1">
              <ArrowDownUp className="h-4 w-4" /> Blockchain Activity
            </h4>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-6 text-xs" 
              onClick={() => setShowTransactions(!showTransactions)}
            >
              {showTransactions ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          {showTransactions && (
            <div className="text-xs">
              {isLoading ? (
                <p className="text-muted-foreground">Loading transaction data...</p>
              ) : blockchainProfile?.latestTransactions && blockchainProfile.latestTransactions.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table className="border rounded-md w-full">
                    <TableHeader>
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="p-1">Date</TableHead>
                        <TableHead className="p-1">Value</TableHead>
                        <TableHead className="p-1">Type</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {blockchainProfile.latestTransactions.slice(0, 3).map((tx) => (
                        <TableRow key={tx.hash} className="hover:bg-muted">
                          <TableCell className="p-1">{formatTimeStamp(tx.timeStamp)}</TableCell>
                          <TableCell className="p-1 font-medium">{formatEther(tx.value)} ETH</TableCell>
                          <TableCell className="p-1">
                            <Badge variant={tx.from.toLowerCase() === passport.owner_address.toLowerCase() ? "destructive" : "default"} className="text-xs">
                              {tx.from.toLowerCase() === passport.owner_address.toLowerCase() ? 'Sent' : 'Received'}
                            </Badge>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground">No transaction history found</p>
              )}
              
              {blockchainProfile && (
                <div className="mt-2 flex flex-col gap-1">
                  <div className="flex justify-between">
                    <span>Balance:</span>
                    <span className="font-medium">{blockchainProfile.balance} ETH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transactions:</span>
                    <span className="font-medium">{blockchainProfile.transactionCount}</span>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* View Profile Button */}
        <div className="mt-4">
          <Link to={`/talent/profile/${encodeURIComponent(passport.passport_id)}/${encodeURIComponent(passport.owner_address)}`}>
            <Button variant="outline" className="w-full">
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Profile
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default TalentProfileCard;
