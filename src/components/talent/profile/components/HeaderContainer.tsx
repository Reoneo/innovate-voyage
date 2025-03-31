
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white shadow-md rounded-sm mx-4">
      <CardHeader className="pb-4">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
          {children}
        </div>
      </CardHeader>
    </Card>
  );
};

export default HeaderContainer;
