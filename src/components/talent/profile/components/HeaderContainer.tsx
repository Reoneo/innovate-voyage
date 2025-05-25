import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
interface HeaderContainerProps {
  children: React.ReactNode;
}
const HeaderContainer: React.FC<HeaderContainerProps> = ({
  children
}) => {
  return <Card className="bg-transparent shadow-none rounded-sm w-full backdrop-blur-none bg-opacity-0 border-none" style={{
    height: 'calc(100vh - 80px)',
    /* Subtract navbar height */
    width: '100%',
    maxWidth: '21cm',
    /* A4 width */
    margin: '0 auto',
    marginTop: '16px',
    /* Add margin top to prevent covering navbar */
    marginBottom: '16px',
    /* Add margin bottom for consistency */
    padding: 0,
    overflow: 'auto',
    borderRadius: '8px'
  }}>
      <CardContent className="p-6 md:p-8 print:p-4 h-full py-[15px] px-[30px] rounded-none my-0 mx-0 bg-gray-50">
        {children}
      </CardContent>
    </Card>;
};
export default HeaderContainer;