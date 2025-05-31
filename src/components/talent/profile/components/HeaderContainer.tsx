
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
    <Card className="bg-white shadow-sm rounded-sm w-full max-w-full backdrop-blur-sm bg-opacity-95 overflow-x-hidden" style={{
      minHeight: isMobile ? 'auto' : 'calc(100vh - 80px)',
      width: '100%',
      maxWidth: '100vw',
      margin: '0 auto',
      marginTop: isMobile ? '4px' : '8px',
      marginBottom: isMobile ? '4px' : '8px',
      padding: 0,
      overflow: 'visible',
      border: '1px solid #f0f0f0',
      borderRadius: '8px'
    }}>
      <CardContent className={`h-auto rounded-none my-0 mx-0 w-full max-w-full overflow-x-hidden ${isMobile ? 'p-2 py-3' : 'p-6 md:p-8 print:p-4 py-[10px] px-[20px]'}`}>
        <div className={`w-full max-w-full ${isMobile ? 'flex flex-col space-y-4' : ''} overflow-x-hidden`}>
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
