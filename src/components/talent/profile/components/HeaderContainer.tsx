
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white shadow-md rounded-sm w-full" style={{
      minHeight: isMobile ? 'auto' : '29.7cm', /* A4 height */
      width: '100%',
      maxWidth: '100%',
    }}>
      <CardContent className="p-8 md:p-12">
        {children}
      </CardContent>
    </Card>
  );
};

export default HeaderContainer;
