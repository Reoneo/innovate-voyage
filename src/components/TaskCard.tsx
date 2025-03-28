
import React from 'react';
import { Task } from '@/types/task';
import { format } from 'date-fns';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle2, 
  Clock, 
  Tag, 
  Trash2, 
  Edit, 
  AlertTriangle 
} from 'lucide-react';
import { 
  Card, 
  CardContent, 
  CardFooter, 
  CardHeader 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit }) => {
  const { deleteTask, updateTask } = useTaskContext();
  
  const handleStatusToggle = () => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed';
    updateTask(task.id, { status: newStatus });
  };
  
  const getPriorityBadge = () => {
    switch (task.priority) {
      case 'low':
        return <span className="priority-badge priority-low">Low</span>;
      case 'medium':
        return <span className="priority-badge priority-medium">Medium</span>;
      case 'high':
        return <span className="priority-badge priority-high">High</span>;
      default:
        return null;
    }
  };
  
  const getStatusClass = () => {
    return task.status === 'completed' ? 'opacity-60' : '';
  };

  return (
    <Card className={`animate-fade-in ${getStatusClass()} task-card`}>
      <CardHeader className="p-4 pb-2 flex flex-row justify-between items-start">
        <div className="flex flex-col">
          <h3 className={`font-semibold text-lg ${task.status === 'completed' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            {getPriorityBadge()}
            {task.status === 'in-progress' && (
              <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">
                In Progress
              </Badge>
            )}
          </div>
        </div>
        <div>
          <Button variant="ghost" size="icon" onClick={() => onEdit(task)}>
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <p className="text-sm text-gray-600 mb-3">{task.description}</p>
        
        {task.dueDate && (
          <div className="flex items-center text-xs text-gray-500 mb-2">
            <Clock className="h-3 w-3 mr-1" />
            <span>
              Due {format(task.dueDate, 'MMM d, yyyy')}
              {task.dueDate < new Date() && task.status !== 'completed' && (
                <span className="text-red-500 ml-1 inline-flex items-center">
                  <AlertTriangle className="h-3 w-3 mr-1" /> Overdue
                </span>
              )}
            </span>
          </div>
        )}
        
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.map(tag => (
              <span 
                key={tag} 
                className="inline-flex items-center text-xs bg-gray-100 text-gray-600 rounded-full px-2 py-1"
              >
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </span>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-2 flex justify-between">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs"
          onClick={handleStatusToggle}
        >
          <CheckCircle2 className={`h-4 w-4 mr-1 ${task.status === 'completed' ? 'text-green-500' : ''}`} />
          {task.status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
        </Button>
        
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-xs text-red-500 hover:text-red-700 hover:bg-red-50"
          onClick={() => deleteTask(task.id)}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TaskCard;
