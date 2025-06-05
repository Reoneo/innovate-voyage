
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
    <div className="w-full flex justify-center px-2 sm:px-4">
      <Card style={{
        minHeight: 'auto',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: isMobile ? '4px' : '16px',
        marginBottom: isMobile ? '4px' : '8px',
        padding: 0,
        overflow: 'visible',
        border: '1px solid #f0f0f0',
        borderRadius: '8px'
      }} className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95">
        <CardContent className={`h-auto rounded-none ${isMobile ? 'p-2' : 'p-4 sm:p-6 md:p-8'}`}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderContainer;
