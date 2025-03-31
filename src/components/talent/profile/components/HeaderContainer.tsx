
import React from 'react';
import { Card, CardHeader } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';

interface HeaderContainerProps {
  children: React.ReactNode;
}

// This component is now a lightweight wrapper since we're using DraggableTile
const HeaderContainer: React.FC<HeaderContainerProps> = ({ children }) => {
  return <>{children}</>;
};

export default HeaderContainer;
