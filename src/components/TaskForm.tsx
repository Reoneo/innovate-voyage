
import React, { useState, useEffect } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface TaskFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTask: Task | null;
}

const defaultTask: Omit<Task, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  priority: 'medium',
  status: 'todo',
  dueDate: null,
  tags: [],
};

const TaskForm: React.FC<TaskFormProps> = ({ isOpen, onClose, editTask }) => {
  const [formData, setFormData] = useState<Omit<Task, 'id' | 'createdAt'>>(defaultTask);
  const [tagInput, setTagInput] = useState('');
  const { addTask, updateTask } = useTaskContext();

  useEffect(() => {
    if (editTask) {
      setFormData({
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status,
        dueDate: editTask.dueDate,
        tags: [...editTask.tags],
      });
    } else {
      setFormData(defaultTask);
    }
    setTagInput('');
  }, [editTask, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      return;
    }
    
    if (editTask) {
      updateTask(editTask.id, formData);
    } else {
      addTask(formData);
    }
    
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData(prev => ({ ...prev, dueDate: date || null }));
  };

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{editTask ? 'Edit Task' : 'Create New Task'}</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="priority">Priority</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleSelectChange('priority', value as TaskPriority)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleSelectChange('status', value as TaskStatus)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.dueDate ? (
                      format(formData.dueDate, 'PPP')
                    ) : (
                      <span>Pick a date</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.dueDate || undefined}
                    onSelect={handleDateChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {formData.dueDate && (
                <Button 
                  type="button"
                  variant="ghost" 
                  className="mt-1 h-8" 
                  onClick={() => handleDateChange(undefined)}
                >
                  Clear date
                </Button>
              )}
            </div>
            
            <div className="grid gap-2">
              <Label htmlFor="tags">Tags</Label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Add tag and press Enter"
                />
                <Button 
                  type="button" 
                  onClick={addTag}
                  variant="secondary"
                >
                  Add
                </Button>
              </div>
              
              {formData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {formData.tags.map(tag => (
                    <span
                      key={tag}
                      className="inline-flex items-center bg-secondary text-secondary-foreground px-2 py-1 rounded-full text-xs"
                    >
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        className="h-4 w-4 p-0 ml-1 text-gray-500 hover:text-gray-700"
                        onClick={() => removeTag(tag)}
                      >
                        &times;
                      </Button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">
              {editTask ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
