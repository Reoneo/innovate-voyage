
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Shield, Award, Globe, Check } from 'lucide-react';
import { BlockchainPassport } from '@/lib/utils';

interface UserInfoProps {
  passport: BlockchainPassport & {
    score: number;
    category: string;
    colorClass: string;
  };
}

const UserInfo: React.FC<UserInfoProps> = ({ passport }) => {
  return (
    <>
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-bold">{passport.passport_id}</h3>
          <p className="text-sm text-muted-foreground">
            {passport.owner_address.substring(0, 6)}...{passport.owner_address.substring(passport.owner_address.length - 4)}
          </p>
        </div>
        <div className="flex items-center gap-1 p-1 rounded-full bg-secondary/80 backdrop-blur-sm">
          <Shield className={`h-4 w-4 ${passport.colorClass}`} />
          <span className={`text-xs font-semibold ${passport.colorClass}`}>CVB {passport.score}</span>
        </div>
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
        <div className="flex justify-between">
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
