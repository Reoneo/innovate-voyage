
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Globe, Check, Info } from 'lucide-react';
import { BlockchainPassport } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface UserInfoProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ passport }) => {
  const isMobile = useIsMobile();

  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold text-sm md:text-base truncate max-w-[150px] md:max-w-none">{passport.passport_id}</h3>
          <p className="text-xs md:text-sm text-muted-foreground">
            {passport.owner_address.substring(0, 6)}...{passport.owner_address.substring(passport.owner_address.length - 4)}
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/80 backdrop-blur-sm">
                <Shield className={`h-4 w-4 ${passport.colorClass}`} />
                <span className={`text-xs font-semibold ${passport.colorClass}`}>CVB {passport.score}</span>
                <Info className="h-3 w-3 ml-0.5 text-muted-foreground" />
              </div>
            </TooltipTrigger>
            <TooltipContent className="p-3 max-w-[250px]">
              <p className="font-semibold mb-1">Human Score Explained</p>
              <p className="text-sm">This score represents blockchain identity validity, based on on-chain activity and interactions.</p>
              <div className="mt-2 text-xs font-medium">
                <div className="flex justify-between">
                  <span>0-30</span>
                  <span className="text-gray-500">New/Limited</span>
                </div>
                <div className="flex justify-between">
                  <span>30-60</span>
                  <span className="text-blue-500">Established</span>
                </div>
                <div className="flex justify-between">
                  <span>60-100</span>
                  <span className="text-purple-500">Trusted</span>
                </div>
              </div>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div>
        <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
          <Award className="h-4 w-4" /> Verification Level
        </h4>
        <div className="bg-secondary/50 rounded-full h-2.5 mb-1">
          <div 
            className={`h-2.5 rounded-full ${
              passport.score >= 90 ? "bg-purple-500" : 
              passport.score >= 75 ? "bg-indigo-500" : 
              passport.score >= 60 ? "bg-blue-500" : 
              passport.score >= 45 ? "bg-emerald-500" : 
              passport.score >= 30 ? "bg-amber-500" : "bg-gray-500"
            }`} 
            style={{ width: `${passport.score}%` }}
          ></div>
        </div>
        <div className="flex justify-between flex-wrap">
          <p className="text-xs text-muted-foreground">{passport.category}</p>
          <div className="flex text-xs text-muted-foreground gap-2">
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>On-chain</span>
            </div>
            <div className="flex items-center gap-1">
              <Check className="h-3 w-3 text-green-500" />
              <span>Verified</span>
            </div>
          </div>
        </div>
      </div>

      {passport.socials && Object.values(passport.socials).some(Boolean) && (
        <div>
          <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
            <Globe className="h-4 w-4" /> Connected Accounts
          </h4>
          <div className="flex flex-wrap gap-2">
            {Object.entries(passport.socials).map(([platform, value]) => 
              value && (
                <Badge key={platform} variant="outline" className="text-xs">
                  {platform}
                </Badge>
              )
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default UserInfo;
