
import React from 'react';
import { Shield, AlertTriangle, CheckCircle } from 'lucide-react';

interface SecuritySummaryProps {
  score: number;
  level: string;
  description: string;
}

const SecuritySummary: React.FC<SecuritySummaryProps> = ({ score, level, description }) => {
  // Determine color based on level
  const getLevelColor = () => {
    switch (level) {
      case 'LOW':
        return 'text-green-500 bg-green-100';
      case 'MEDIUM':
        return 'text-yellow-500 bg-yellow-100';
      case 'HIGH':
        return 'text-orange-500 bg-orange-100';
      case 'CRITICAL':
        return 'text-red-500 bg-red-100';
      default:
        return 'text-gray-500 bg-gray-100';
    }
  };

  // Determine the icon based on level
  const SecurityIcon = () => {
    switch (level) {
      case 'LOW':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'MEDIUM':
      case 'HIGH':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case 'CRITICAL':
        return <Shield className="h-5 w-5 text-red-500" />;
      default:
        return <Shield className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center space-y-2">
        {/* Security Score */}
        <div className="text-center">
          <div className={`text-4xl font-bold ${level === 'UNKNOWN' ? 'text-gray-500' : ''}`}>
            {score > 0 ? score : 'N/A'}
          </div>
          <div className="text-sm text-muted-foreground">Security Score</div>
        </div>
        
        {/* Security Level */}
        <div className={`px-3 py-1 rounded-full ${getLevelColor()}`}>
          <div className="flex items-center gap-1">
            <SecurityIcon />
            <span className="text-sm font-medium">{level}</span>
          </div>
        </div>
        
        {/* Description */}
        <p className="text-sm text-center text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

export default SecuritySummary;
