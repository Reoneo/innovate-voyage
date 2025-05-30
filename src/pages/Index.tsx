import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, Plus, Mail, Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import SeoHelmet from '@/components/home/SeoHelmet';
import { isValidEthereumAddress } from '@/lib/utils';
import { toast } from 'sonner';
const Index = () => {
  const navigate = useNavigate();
  const [searchInput, setSearchInput] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInput.trim()) {
      return;
    }
    let searchValue = searchInput.trim();
    if (!searchValue.includes('.') && !isValidEthereumAddress(searchValue) && /^[a-zA-Z0-9]+$/.test(searchValue)) {
      searchValue = `${searchValue}.eth`;
    }
    navigate(`/${searchValue}`);
    toast.success(`Looking up profile for ${searchValue}`);
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <SeoHelmet />
      
      {/* Header Section */}
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"></div>
        
        <div className="relative container mx-auto px-4 sm:px-6 py-16 text-center">
          <div className="mb-8">
            <div className="flex justify-center mb-6">
              <Avatar className="h-32 w-32 border-4 border-white/20 shadow-2xl">
                <AvatarImage src="/lovable-uploads/d713fade-f512-4f1f-8c8b-8e24e611845b.png" alt="Recruitment.box Logo" />
                <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">RB</AvatarFallback>
              </Avatar>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              Reserve Your Professional ID
            </h1>
            
            
            
            <Button asChild size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-3 text-lg font-semibold shadow-xl">
              
            </Button>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="py-16 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Decentralized CV & Recruitment Engine
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Find talent, verify skills, and connect with professionals in Web3
            </p>
          </div>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-12">
            <form onSubmit={handleSearch} className="flex gap-2">
              <div className="relative flex-grow">
                <Input placeholder="Search by ENS, address or domain" value={searchInput} onChange={e => setSearchInput(e.target.value)} className="h-14 text-lg pl-14 pr-4 bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:bg-white/20 focus:border-blue-400" aria-label="Search profiles" />
                <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                  <Search className="h-6 w-6 text-gray-400" aria-hidden="true" />
                </div>
              </div>
              <Button type="submit" size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </form>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl min-w-[160px]" onClick={() => toast.info("Browse Talent feature coming soon!")}>
              <Users className="mr-2 h-5 w-5" />
              Browse Talent
            </Button>
            
            
            
            <Button size="lg" className="h-14 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl min-w-[160px]" onClick={() => toast.info("List Jobs feature coming soon!")}>
              <Plus className="mr-2 h-5 w-5" />
              List Jobs
            </Button>
          </div>
        </div>
      </section>

      {/* Navigation */}
      <nav className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
        
      </nav>

      {/* Hidden SEO Content */}
      <div className="sr-only">
        blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, 
        blockchain verification, crypto recruitment, web3 jobs, ens profiles,
        decentralized hiring, blockchain cv, web3 talent, crypto jobs,
        ethereum recruitment, blockchain jobs, web3 hiring platform
      </div>
    </div>;
};
export default Index;