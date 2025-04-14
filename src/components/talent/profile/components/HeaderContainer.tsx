
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return (
    <Card className="bg-white shadow-md rounded-sm w-full mx-auto" style={{
      height: 'auto',
      width: '100%',
      maxWidth: '100%',
      margin: '0 auto',
      padding: 0,
      overflow: 'hidden', /* Changed from auto to hidden to prevent scrollbars */
    }}>
      <CardContent className="p-4 print:p-4">
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
