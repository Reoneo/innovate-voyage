
import React from 'react';
import { Shield, Database, Search } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const FeaturesSection: React.FC = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <Card className="glass-card">
        <CardHeader>
          <Shield className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
          <CardTitle>Decentralized Identity</CardTitle>
          <CardDescription>
            Verify your skills and experience through blockchain credentials
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Use your ENS domain and on-chain data to create a verified, 
            tamper-proof professional profile.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <Database className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
          <CardTitle>On-Chain Verification</CardTitle>
          <CardDescription>
            Your contributions and achievements are cryptographically verified
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Smart contract history, DAO participation, and verified Git commits
            provide objective proof of your skills.
          </p>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <Search className="h-12 w-12 text-primary mb-4" aria-hidden="true" />
          <CardTitle>AI-Powered Matching</CardTitle>
          <CardDescription>
            Intelligent algorithms find the perfect job match
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Our Web3-native matching algorithm analyzes your on-chain activity
            to recommend the most suitable opportunities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FeaturesSection;
