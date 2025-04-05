
import React, { useState } from 'react';
import { Search, Briefcase, PlusCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast({
        title: "Search field is empty",
        description: "Please enter an ENS name or Ethereum address to search.",
        variant: "destructive"
      });
      return;
    }
    
    navigate(`/${searchQuery.trim()}`);
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-muted">
      <header className="container mx-auto px-4 py-6">
        <nav className="flex justify-between items-center">
          <div className="text-2xl font-bold text-primary">TalentLayer</div>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={() => navigate('/jobs')}>Jobs</Button>
            <Link to="/jobs">
              <Button variant="outline">Browse Talent</Button>
            </Link>
          </div>
        </nav>
      </header>
      
      <main className="flex-1 container mx-auto px-4 flex flex-col items-center justify-center text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Find Web3 
            <span className="text-primary"> Talent</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-8">
            Discover verified web3 developers, designers, and professionals with on-chain credentials
          </p>
          
          <form onSubmit={handleSearch} className="w-full max-w-lg mx-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by ENS or Ethereum address"
                className="w-full pl-10 pr-20 py-6 text-lg rounded-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Button 
                type="submit" 
                className="absolute right-1 top-1/2 transform -translate-y-1/2 rounded-full"
              >
                Search
              </Button>
            </div>
          </form>
          
          <div className="flex justify-center gap-4 mt-4">
            <Link to="/jobs">
              <Button variant="outline" className="gap-2">
                <Briefcase className="h-4 w-4" />
                Browse Jobs
              </Button>
            </Link>
            <Button variant="outline" className="gap-2" disabled>
              <PlusCircle className="h-4 w-4" />
              List Jobs
            </Button>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto px-4 py-6 border-t">
        <div className="flex justify-between items-center">
          <div className="text-sm text-muted-foreground">
            &copy; 2023 TalentLayer. All rights reserved.
          </div>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms</a>
            <a href="#" className="text-sm text-muted-foreground hover:text-foreground">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
