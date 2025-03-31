
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderContainerProps {
  children: React.ReactNode;
}

const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  const isMobile = useIsMobile();

  return (
    <Card className="bg-white shadow-md rounded-sm mx-0 w-full">
      <CardHeader className="pb-8 pt-8 px-8">
        <div className="flex flex-col md:flex-row gap-6 items-center md:items-start w-full">
          {children}
        </div>
      </CardHeader>
    </Card>
  );
};

export default HeaderContainer;
