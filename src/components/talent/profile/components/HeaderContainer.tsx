
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
  return <Card style={{
    minHeight: isMobile ? 'auto' : 'calc(100vh - 80px)',
    width: '100%',
    maxWidth: '100vw',
    margin: '0 auto',
    marginTop: isMobile ? '16px' : '24px', // Reduced from 48px/56px to match sides
    marginBottom: isMobile ? '4px' : '8px',
    padding: 0,
    overflow: 'visible',
    border: '1px solid #f0f0f0',
    borderRadius: '8px'
  }} className="bg-white shadow-sm rounded-sm w-full backdrop-blur-sm bg-opacity-95 my-0">
      <CardContent className={`h-auto rounded-none my-0 mx-0 ${isMobile ? 'p-2 py-3' : 'p-6 md:p-8 print:p-4 py-[10px] px-[20px]'}`}>
        {children}
      </CardContent>
    </Card>;
};

export default HeaderContainer;
