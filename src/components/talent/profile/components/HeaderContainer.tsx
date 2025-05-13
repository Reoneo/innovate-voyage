
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return (
    <Card className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95" style={{
      height: 'calc(100vh - 80px)', /* Subtract navbar height */
      width: '100%',
      maxWidth: '21cm', /* A4 width */
      margin: '0 auto',
      marginTop: '1rem', /* Equal spacing on all sides - 16px */
      marginBottom: '1rem', /* Equal spacing on all sides - 16px */
      padding: 0,
      overflow: 'auto',
      border: '1px solid #f0f0f0',
      borderRadius: '8px',
    }}>
      <CardContent className="p-4 md:p-6 print:p-4 h-full">
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
