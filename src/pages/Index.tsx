
import React from 'react';
import TaskDashboard from '@/components/TaskDashboard';
import { TaskProvider } from '@/context/TaskContext';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <TaskProvider>
        <TaskDashboard />
      </TaskProvider>
    </div>
  );
};

export default Index;
