
import React, { createContext, useContext, useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useToast } from '@/hooks/use-toast';

type TaskContextType = {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  filteredTasks: Task[];
  setFilter: (filter: TaskFilter) => void;
  currentFilter: TaskFilter;
};

type TaskFilter = {
  status?: TaskStatus | 'all';
  priority?: TaskPriority | 'all';
  searchTerm?: string;
};

const defaultTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project proposal',
    description: 'Draft and finalize the project proposal document',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)),
    createdAt: new Date(),
    tags: ['work', 'proposal']
  },
  {
    id: '2',
    title: 'Design user dashboard',
    description: 'Create wireframes and prototypes for the user dashboard',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 5)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['design', 'ui']
  },
  {
    id: '3',
    title: 'Research competitors',
    description: 'Analyze competitor products and identify opportunities',
    priority: 'low',
    status: 'completed',
    dueDate: null,
    createdAt: new Date(new Date().setDate(new Date().getDate() - 3)),
    tags: ['research', 'strategy']
  },
  {
    id: '4',
    title: 'Schedule team meeting',
    description: 'Coordinate with team members and set up a meeting',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 1)),
    tags: ['team', 'planning']
  },
  {
    id: '5',
    title: 'Update documentation',
    description: 'Review and update project documentation with latest changes',
    priority: 'low',
    status: 'todo',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)),
    createdAt: new Date(new Date().setDate(new Date().getDate() - 2)),
    tags: ['docs', 'maintenance']
  }
];

export const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [tasks, setTasks] = useState<Task[]>(defaultTasks);
  const [filteredTasks, setFilteredTasks] = useState<Task[]>(defaultTasks);
  const [currentFilter, setCurrentFilter] = useState<TaskFilter>({ status: 'all', priority: 'all', searchTerm: '' });
  const { toast } = useToast();

  useEffect(() => {
    applyFilters();
  }, [tasks, currentFilter]);

  const applyFilters = () => {
    let result = [...tasks];
    
    // Filter by status
    if (currentFilter.status && currentFilter.status !== 'all') {
      result = result.filter(task => task.status === currentFilter.status);
    }
    
    // Filter by priority
    if (currentFilter.priority && currentFilter.priority !== 'all') {
      result = result.filter(task => task.priority === currentFilter.priority);
    }
    
    // Filter by search term
    if (currentFilter.searchTerm) {
      const term = currentFilter.searchTerm.toLowerCase();
      result = result.filter(task => 
        task.title.toLowerCase().includes(term) || 
        task.description.toLowerCase().includes(term) ||
        task.tags.some(tag => tag.toLowerCase().includes(term))
      );
    }
    
    setFilteredTasks(result);
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date()
    };
    
    setTasks([...tasks, newTask]);
    toast({
      title: "Task created",
      description: `"${newTask.title}" has been added to your tasks.`,
    });
  };

  const updateTask = (taskId: string, updates: Partial<Task>) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, ...updates } : task
    );
    
    setTasks(updatedTasks);
    toast({
      title: "Task updated",
      description: "The task has been successfully updated.",
    });
  };

  const deleteTask = (taskId: string) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    setTasks(tasks.filter(task => task.id !== taskId));
    
    toast({
      title: "Task deleted",
      description: `"${taskToDelete?.title}" has been removed from your tasks.`,
      variant: "destructive",
    });
  };

  const setFilter = (filter: TaskFilter) => {
    setCurrentFilter(filter);
  };

  return (
    <TaskContext.Provider value={{ 
      tasks, 
      addTask, 
      updateTask, 
      deleteTask, 
      filteredTasks, 
      setFilter,
      currentFilter
    }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTaskContext = () => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
};
