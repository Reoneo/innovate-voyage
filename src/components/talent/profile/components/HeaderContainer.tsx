
import React from 'react';

interface HeaderContainerProps {
  children: React.ReactNode;
  className?: string;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children, className = '' }) => {
  return (
    <div className={`w-full max-w-6xl mx-auto bg-opacity-50 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg p-6 md:p-8 ${className}`}>
      {children}
    </div>
  );
};

export default HeaderContainer;
