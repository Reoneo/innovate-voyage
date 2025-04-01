
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return (
    <Card className="bg-white shadow-md rounded-sm w-full" style={{
      height: '29.7cm', /* A4 height */
      width: '100%',
      maxWidth: '21cm', /* A4 width */
      margin: '0 auto',
      padding: 0,
      overflow: 'auto',
    }}>
      <CardContent className="p-8 md:p-12 h-full">
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
