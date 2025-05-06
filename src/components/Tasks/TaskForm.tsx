
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface TaskFormProps {
  editTask?: Task;
  onSubmit: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ editTask, onSubmit }) => {
  const { addTask, updateTask } = useTasks();
  
  const [title, setTitle] = useState(editTask?.title || '');
  const [description, setDescription] = useState(editTask?.description || '');
  const [dueDate, setDueDate] = useState<Date | undefined>(editTask?.dueDate || new Date());
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>(editTask?.priority || 'medium');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!title.trim()) {
      setError('제목을 입력해주세요');
      return;
    }
    
    if (!dueDate) {
      setError('마감일을 선택해주세요');
      return;
    }
    
    if (editTask) {
      // Update existing task
      updateTask(editTask.id, {
        title,
        description,
        dueDate,
        priority,
      });
    } else {
      // Add new task
      addTask({
        title,
        description,
        dueDate,
        priority,
        completed: false
      });
    }
    
    // Close form
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Form title and description fields */}
      <div className="space-y-2">
        <Input 
          placeholder="제목" 
          value={title} 
          onChange={e => {
            setTitle(e.target.value);
            setError(null);
          }}
          className={error && !title.trim() ? "border-red-500" : ""}
        />
        {error && !title.trim() && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>
      
      <Textarea 
        placeholder="설명" 
        value={description} 
        onChange={e => setDescription(e.target.value)}
        className="min-h-[100px]"
      />

      {/* Due date picker */}
      <div className="space-y-2">
        <label className="text-sm font-medium">마감일</label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={`w-full justify-start text-left font-normal ${!dueDate ? "text-muted-foreground" : ""}`}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {dueDate ? format(dueDate, "PPP") : <span>날짜 선택</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={dueDate}
              onSelect={(date) => {
                setDueDate(date);
                setError(null);
              }}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        {error && !dueDate && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Priority selector */}
      <div className="space-y-2">
        <label className="text-sm font-medium">우선순위</label>
        <Select 
          value={priority} 
          onValueChange={(value: 'low' | 'medium' | 'high') => setPriority(value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="우선순위 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">낮음</SelectItem>
            <SelectItem value="medium">중간</SelectItem>
            <SelectItem value="high">높음</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Submit button */}
      <Button type="submit" className="w-full">
        {editTask ? "수정하기" : "추가하기"}
      </Button>
    </form>
  );
};

export default TaskForm;
