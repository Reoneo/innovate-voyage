import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Users, Briefcase, Plus, ArrowRight, Shield, Globe, Zap, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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
  const handleSmithBoxClick = () => {
    navigate('/smith.box');
    toast.success('Loading smith.box profile');
  };
  const features = [{
    icon: Shield,
    title: "Blockchain Verified",
    description: "All profiles are verified through blockchain data and on-chain activity"
  }, {
    icon: Globe,
    title: "Decentralized",
    description: "Built on Web3 infrastructure for transparency and trust"
  }, {
    icon: Zap,
    title: "Instant Verification",
    description: "Real-time verification of skills, experience, and credentials"
  }];
  const stats = [{
    number: "10K+",
    label: "Verified Profiles"
  }, {
    number: "500+",
    label: "Companies"
  }, {
    number: "2K+",
    label: "Jobs Posted"
  }, {
    number: "95%",
    label: "Match Success"
  }];
  return <div className="min-h-screen relative overflow-hidden">
      <SeoHelmet />
      
      {/* Animated Professional Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
        {/* Floating geometric shapes */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-32 h-32 bg-blue-500/10 rounded-full animate-pulse"></div>
          <div className="absolute top-40 right-20 w-24 h-24 bg-purple-500/10 rounded-lg rotate-45 animate-bounce"></div>
          <div className="absolute bottom-32 left-1/4 w-40 h-40 bg-indigo-500/10 rounded-full animate-pulse delay-1000"></div>
          <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-cyan-500/10 rounded-lg rotate-12 animate-bounce delay-500"></div>
          <div className="absolute top-1/2 left-1/2 w-36 h-36 bg-blue-400/5 rounded-full animate-ping"></div>
        </div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
        
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center">
              <Badge variant="secondary" className="mb-4 px-4 py-2 bg-white/10 text-white border-white/20">
                🚀 The Future of Recruitment
              </Badge>
              
              {/* Hidden h1, moved h2 content here */}
              <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
                Find Talent on the
                <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"> Blockchain</span>
              </h1>
              
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-12">
                Recruitment.box is the first decentralized CV & recruitment engine. 
                Discover verified Web3 talent, post jobs, and hire with confidence using blockchain-verified credentials.
              </p>

              {/* Search Bar */}
              <div className="max-w-2xl mx-auto mb-8">
                <form onSubmit={handleSearch} className="flex gap-2">
                  <div className="relative flex-grow">
                    <Input placeholder="Search by ENS name, address, or domain..." value={searchInput} onChange={e => setSearchInput(e.target.value)} className="h-12 text-base pl-12 pr-4 border-2 border-white/20 focus:border-blue-400 bg-white/10 backdrop-blur-sm text-white placeholder:text-gray-400" aria-label="Search profiles" />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                      <Search className="h-5 w-5 text-gray-400" aria-hidden="true" />
                    </div>
                  </div>
                  <Button type="submit" size="lg" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Search
                  </Button>
                </form>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <Button size="lg" variant="default" className="h-12 px-8 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-xl" onClick={() => toast.info("Browse Talent feature coming soon!")}>
                  <Users className="mr-2 h-5 w-5" />
                  Browse Talent
                </Button>
                
                
                
                <Button size="lg" variant="secondary" className="h-12 px-8 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-xl" onClick={() => toast.info("List Jobs feature coming soon!")}>
                  <Plus className="mr-2 h-5 w-5" />
                  List Jobs
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Profile Section */}
        <section className="py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Featured Profile
              </h2>
              <p className="text-xl text-gray-300">
                Discover verified Web3 professionals
              </p>
            </div>

            <div className="flex justify-center">
              <Card className="cursor-pointer transform hover:scale-105 transition-all duration-300 bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 max-w-sm" onClick={handleSmithBoxClick}>
                <CardContent className="p-8 text-center">
                  <div className="relative mb-6">
                    <Avatar className="h-24 w-24 mx-auto border-4 border-white/20 shadow-2xl">
                      <AvatarImage src="https://metadata.ens.domains/mainnet/avatar/smith.box" alt="smith.box avatar" />
                      <AvatarFallback className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-2xl font-bold">SB</AvatarFallback>
                    </Avatar>
                    <div className="absolute -top-2 -right-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    </div>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-white mb-2">smith.box</h3>
                  <p className="text-gray-300 mb-4">Web3 Domain Expert</p>
                  
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/20">
                    View Profile
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-white/5 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => <div key={index} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-300">
                    {stat.label}
                  </div>
                </div>)}
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Why Choose Recruitment.box?
              </h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Built for the Web3 era with blockchain verification and decentralized infrastructure
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => <Card key={index} className="bg-white/10 backdrop-blur-sm border-white/20 hover:bg-white/20 transition-all duration-300">
                  <CardContent className="p-8 text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg mb-6">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-white mb-4">
                      {feature.title}
                    </h3>
                    <p className="text-gray-300">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>)}
            </div>
          </div>
        </section>

        {/* Hidden SEO Content */}
        <div className="sr-only">
          blockchain recruitment, web3 cv, decentralized talent, ethereum hiring, 
          blockchain verification, crypto recruitment, web3 jobs, ens profiles,
          decentralized hiring, blockchain cv, web3 talent, crypto jobs,
          ethereum recruitment, blockchain jobs, web3 hiring platform
        </div>
      </div>
    </div>;
};
export default Index;