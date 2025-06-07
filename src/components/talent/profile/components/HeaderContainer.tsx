
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
    <div className="w-full flex justify-center px-1">
      <Card style={{
        minHeight: 'auto',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: isMobile ? '1px' : '4px',
        marginBottom: isMobile ? '1px' : '2px',
        padding: 0,
        overflow: 'visible',
        border: '1px solid #f0f0f0',
        borderRadius: '6px'
      }} className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95">
        <CardContent className={`h-auto rounded-none ${isMobile ? 'p-1' : 'p-2'}`}>
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderContainer;
