
import React from 'react';
import { Link } from 'react-router-dom';
import WalletConnectButton from '../../wallet/WalletConnectButton';

const ProfileNavigationBar: React.FC = () => {
  return (
    <div className="w-full bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link to="/" className="flex items-center">
                <img 
                  src="/lovable-uploads/f64eb31d-31b2-49af-ab07-c31aecdacd10.png" 
                  alt="Recruitment.box Logo" 
                  className="h-8 w-8 mr-2"
                />
                <span className="text-xl font-semibold text-gray-900 dark:text-white">recruitment.box</span>
              </Link>
            </div>
          </div>
          <div className="flex items-center">
            <WalletConnectButton />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileNavigationBar;
