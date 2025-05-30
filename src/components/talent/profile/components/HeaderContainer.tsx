
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children
}) => {
  return (
    <Card className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95" style={{
      height: 'calc(100vh - 80px)',
      width: '100%',
      maxWidth: '95vw', // Increased from 21cm to 95% of viewport width
      margin: '0 auto',
      marginTop: '8px', // Reduced from 16px
      marginBottom: '8px', // Reduced from 16px
      padding: 0,
      overflow: 'auto',
      border: '1px solid #f0f0f0',
      borderRadius: '8px'
    }}>
      <CardContent className="p-6 md:p-8 print:p-4 h-full py-[10px] px-[20px] rounded-none my-0 mx-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
