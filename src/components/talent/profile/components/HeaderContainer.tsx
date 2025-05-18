
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children
}) => {
  const isMobile = useIsMobile();

  return (
    <Card 
      className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95" 
      style={{
        height: 'calc(100vh - 80px)', /* Subtract navbar height */
        width: '100%',
        maxWidth: '21cm', /* A4 width */
        margin: '0 auto',
        marginTop: '16px', /* Add margin top to prevent covering navbar */
        marginBottom: '16px', /* Add margin bottom for consistency */
        padding: 0,
        overflow: 'auto',
        border: isMobile ? '1px solid #f0f0f0' : '1px solid #f0f0f0',
        borderRadius: '8px'
      }}
    >
      <CardContent 
        className={`${isMobile ? 'p-3' : 'p-6 md:p-8'} print:p-4 h-full rounded-none my-0 mx-0`}
      >
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
