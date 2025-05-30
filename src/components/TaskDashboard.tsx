
import React, { useState } from 'react';
import { PlusCircle } from 'lucide-react';
import { useTaskContext } from '@/context/TaskContext';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilter from './TaskFilter';
import { Button } from '@/components/ui/button';
import { Task } from '@/types/task';

const TaskDashboard: React.FC = () => {
  const { filteredTasks } = useTaskContext();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  
  const handleAddClick = () => {
    setEditingTask(null);
    setIsFormOpen(true);
  };
  
  const handleEditClick = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };
  
  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingTask(null);
  };
  
  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 px-4 mt-8 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50">
      <img 
        src="https://cdn.gpteng.co/placeholder.svg" 
        alt="No tasks found" 
        className="w-32 h-32 mb-6 opacity-50"
      />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
      <p className="text-gray-500 text-center mb-6 max-w-md">
        {filteredTasks.length === 0 ? 
          "You don't have any tasks yet. Create your first task to get started!" : 
          "No tasks match your current filters. Try adjusting your filters or create a new task."}
      </p>
      <Button onClick={handleAddClick}>
        <PlusCircle className="mr-2 h-4 w-4" />
        Create New Task
      </Button>
    </div>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Task Dashboard</h1>
          <p className="text-gray-500 mt-1">
            {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'} available
          </p>
        </div>
        
        <Button onClick={handleAddClick} size="lg">
          <PlusCircle className="mr-2 h-5 w-5" />
          New Task
        </Button>
      </div>
      
      <TaskFilter />
      
      {filteredTasks.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task}
              onEdit={handleEditClick}
            />
          ))}
        </div>
      )}
      
      <TaskForm 
        isOpen={isFormOpen}
        onClose={handleCloseForm}
        editTask={editingTask}
      />
    </div>
  );
};

export default TaskDashboard;
