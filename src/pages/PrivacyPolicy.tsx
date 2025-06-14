
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import Footer from '@/components/home/Footer';
import { ArrowLeft } from 'lucide-react';

const PrivacyPolicy: React.FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Privacy Policy | recruitment.box</title>
        <meta name="description" content="Privacy Policy for recruitment.box - A decentralized CV & recruitment engine" />
      </Helmet>
      
      <div className="container mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" className="pl-0">
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Home
            </Button>
          </Link>
        </div>
        
        <div className="prose prose-slate dark:prose-invert max-w-none mb-16">
          <h1 className="text-4xl font-bold mb-8">Privacy Policy</h1>
          
          <p className="text-muted-foreground mb-8">
            Last Updated: May 4, 2025
          </p>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
            <p>
              Welcome to recruitment.box ("we," "our," or "us"). We respect your privacy and are committed to protecting your personal data. 
              This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our decentralized CV and recruitment engine.
            </p>
            <p>
              As a blockchain-based platform, we combine traditional data protection practices with decentralized technology principles. 
              This policy is compliant with global privacy regulations, including GDPR, CCPA, and requirements of service providers such as LinkedIn.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">2. Information We Collect</h2>
            <h3 className="text-xl font-medium mb-3">2.1 Information You Provide</h3>
            <p>We may collect the following information:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Wallet addresses and blockchain identifiers</li>
              <li>ENS (Ethereum Name Service) domains and associated records</li>
              <li>Profile information you choose to display (name, bio, skills, work experience)</li>
              <li>Social media handles and connections (including LinkedIn, GitHub, and others)</li>
              <li>Professional history and qualifications</li>
              <li>Communications with other users through our platform</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-3">2.2 Information From Third-Party Services</h3>
            <p>When you connect third-party accounts, we may collect:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>LinkedIn profile data (when you authenticate via LinkedIn OAuth)</li>
              <li>Professional experience, positions, and work history</li>
              <li>GitHub contributions and repository activity</li>
              <li>Public blockchain data associated with your wallet address</li>
              <li>NFT ownership and digital assets</li>
            </ul>
            
            <h3 className="text-xl font-medium mb-3">2.3 Automatically Collected Information</h3>
            <p>We may automatically collect certain information when you use our platform:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Device information and identifiers</li>
              <li>IP address and location information</li>
              <li>Browser type and settings</li>
              <li>Usage data and interactions with our service</li>
              <li>Blockchain transaction data that is publicly available</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">3. How We Use Your Information</h2>
            <p>We use the information we collect for various purposes:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Creating and displaying your decentralized CV/profile</li>
              <li>Verifying skills and credentials through blockchain data</li>
              <li>Enabling recruitment and professional connections</li>
              <li>Improving and personalizing our services</li>
              <li>Communicating with you about our services</li>
              <li>Analyzing usage patterns to enhance user experience</li>
              <li>Ensuring the security and integrity of our platform</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">4. LinkedIn Data Usage</h2>
            <p>
              When you connect your LinkedIn account to recruitment.box, we access your profile data through LinkedIn's APIs in accordance with 
              LinkedIn's Platform Terms and LinkedIn's Privacy Policy. Specifically:
            </p>
            <ul className="list-disc pl-6 mb-4">
              <li>We only request the minimum necessary permissions to display your professional experience</li>
              <li>Your LinkedIn data is only used to populate your recruitment.box profile and is not sold to third parties</li>
              <li>We do not scrape, cache for longer than permitted, or store your LinkedIn data beyond what is necessary for providing our services</li>
              <li>You can disconnect your LinkedIn account at any time, after which we will no longer access your LinkedIn data</li>
            </ul>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">5. Data Sharing and Disclosure</h2>
            <p>We may share your information with:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Other users of the platform, as part of your public profile</li>
              <li>Service providers who help us operate our platform</li>
              <li>Business partners, with your consent</li>
              <li>Legal authorities when required by law</li>
            </ul>
            <p>
              As a blockchain-based service, certain information is inherently public on the blockchain. 
              We will clearly indicate which aspects of your data are stored on-chain versus off-chain.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">6. Your Rights and Choices</h2>
            <p>Depending on your location, you may have the following rights:</p>
            <ul className="list-disc pl-6 mb-4">
              <li>Access and receive a copy of your personal data</li>
              <li>Correct inaccurate data</li>
              <li>Request deletion of your data (subject to blockchain limitations)</li>
              <li>Restrict or object to certain processing activities</li>
              <li>Data portability</li>
              <li>Withdraw consent at any time for activities based on consent</li>
            </ul>
            <p>
              Please note that due to the nature of blockchain technology, some data that is recorded on-chain cannot be deleted. 
              However, we minimize on-chain storage of personal data.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">7. Security</h2>
            <p>
              We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet 
              or electronic storage is 100% secure. We strive to use commercially acceptable means to protect your personal information, but cannot 
              guarantee its absolute security.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">8. International Data Transfers</h2>
            <p>
              Your information may be transferred to and processed in countries other than your country of residence. These countries may have 
              different data protection laws. When we transfer your information, we will protect it as described in this Privacy Policy and comply 
              with applicable legal requirements for transferring personal data internationally.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">9. Children's Privacy</h2>
            <p>
              Our services are not directed to children under 18. We do not knowingly collect personal information from children. 
              If you believe we have collected information from a child, please contact us so we can delete the information.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">10. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy periodically to reflect changes in our practices or for legal, operational, or regulatory reasons. 
              We will notify you of any material changes by posting the updated policy on our website with a new effective date.
            </p>
          </section>
          
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">11. Contact Us</h2>
            <p>
              If you have questions about this Privacy Policy or our privacy practices, please contact us at:
            </p>
            <p className="mt-2">
              <strong>Email:</strong> hello@smith.box
            </p>
            <p>
              <strong>Address:</strong> Bedford, United Kindom
            </p>
          </section>
        </div>
        
        <Footer />
      </div>
    </div>
  );
};

export default PrivacyPolicy;
