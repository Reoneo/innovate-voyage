
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from "@/hooks/use-mobile";

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children
}) => {
  const isMobile = useIsMobile();
  
  return (
    <Card className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95" style={{
      height: 'calc(100vh - 80px)',
      width: '100%',
      maxWidth: isMobile ? '100vw' : '95vw',
      margin: '0 auto',
      marginTop: '8px',
      marginBottom: '8px',
      padding: 0,
      overflow: 'auto',
      border: '1px solid #f0f0f0',
      borderRadius: '8px'
    }}>
      <CardContent className={`h-full rounded-none my-0 mx-0 ${isMobile ? 'p-2 py-3 px-3' : 'p-6 md:p-8 print:p-4 py-[10px] px-[20px]'}`}>
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
