
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from 'lucide-react';

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Talent Match</h1>
        <p className="text-lg text-gray-700 max-w-2xl mx-auto">
          Find the perfect web3 job for your blockchain skills, verified through your on-chain activity.
        </p>
      </div>
      
      <div className="w-full max-w-3xl">
        <div className="relative mb-6">
          <Input
            type="text"
            placeholder="Search for jobs or enter your ENS name/wallet address..."
            className="pl-10 py-6 text-lg"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        </div>
        
        <div className="flex justify-center gap-4">
          <Link to="/jobs">
            <Button size="lg" className="px-8">
              Browse Jobs
            </Button>
          </Link>
          <Button size="lg" className="px-8" variant="outline" disabled>
            List Jobs
          </Button>
        </div>
      </div>
      
      <div className="mt-16 text-center">
        <h2 className="text-2xl font-semibold mb-4">How it Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">1</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Connect Your Wallet</h3>
            <p className="text-gray-600">Link your Ethereum wallet to automatically verify your skills and experience from on-chain activity.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">2</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Build Your Profile</h3>
            <p className="text-gray-600">Your blockchain activity generates a verified talent profile showing your web3 skills and contributions.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-primary font-bold text-xl">3</span>
            </div>
            <h3 className="font-medium text-lg mb-2">Apply to Jobs</h3>
            <p className="text-gray-600">Browse web3 job opportunities and apply with your verified on-chain credentials.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
