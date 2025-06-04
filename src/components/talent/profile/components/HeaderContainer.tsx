
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
    <div className="w-full flex justify-center px-2 md:px-4">
      <Card style={{
        minHeight: 'calc(100vh - 80px)',
        width: '100%',
        maxWidth: '1200px',
        margin: '0 auto',
        marginTop: '16px',
        marginBottom: '8px',
        padding: 0,
        overflow: 'visible',
        border: '1px solid #f0f0f0',
        borderRadius: '8px'
      }} className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95">
        <CardContent className="h-auto rounded-none p-6 md:p-8">
          {children}
        </CardContent>
      </Card>
    </div>
  );
};

export default HeaderContainer;
