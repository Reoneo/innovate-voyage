
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Move } from 'lucide-react';

interface DraggableTileProps {
  title: string;
  defaultPosition?: { x: number; y: number };
  defaultSize?: { width: number; height: number };
  minWidth?: number;
  minHeight?: number;
  className?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
}

const DraggableTile = ({
  title,
  defaultPosition = { x: 0, y: 0 },
  defaultSize = { width: 400, height: 350 },
  minWidth = 250,
  minHeight = 200,
  className = '',
  children,
  icon,
}: DraggableTileProps) => {
  const [position, setPosition] = useState(defaultPosition);
  const [size, setSize] = useState(defaultSize);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y,
      });
    } else if (isResizing) {
      setSize({
        width: Math.max(minWidth, e.clientX - position.x),
        height: Math.max(minHeight, e.clientY - position.y),
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
  };

  const handleResizeStart = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsResizing(true);
  };

  React.useEffect(() => {
    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleMouseMove as any);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove as any);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, isResizing]);

  return (
    <Card
      className={`absolute shadow-lg overflow-hidden ${className}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size.width}px`,
        height: `${size.height}px`,
        zIndex: isDragging ? 10 : 'auto',
      }}
    >
      <CardHeader className="p-3 cursor-move" onMouseDown={handleMouseDown}>
        <CardTitle className="text-lg flex items-center gap-2">
          {icon}
          {title}
          <Move className="h-4 w-4 ml-auto text-muted-foreground" />
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 overflow-auto" style={{ height: 'calc(100% - 48px)' }}>
        {children}
      </CardContent>
      <div
        className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize"
        onMouseDown={handleResizeStart}
        style={{
          backgroundImage: 'linear-gradient(135deg, transparent 50%, rgba(0,0,0,0.2) 50%)',
        }}
      />
    </Card>
  );
};

export default DraggableTile;
