
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Award, Globe, Check } from 'lucide-react';
import { BlockchainPassport } from '@/lib/utils';
import { useIsMobile } from '@/hooks/use-mobile';

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
      </div>

      <div>
        <h4 className="text-sm font-medium flex items-center gap-1 mb-2">
          <Award className="h-4 w-4" /> Verification Level
        </h4>
        <div className="flex justify-between flex-wrap">
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
