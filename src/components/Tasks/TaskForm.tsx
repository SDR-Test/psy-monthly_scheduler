
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
import { CalendarIcon, Clock } from 'lucide-react';

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
  
  // 시간 상태 추가
  const [hours, setHours] = useState<string>(() => {
    if (editTask?.dueDate) {
      return String(editTask.dueDate.getHours()).padStart(2, '0');
    }
    return "09"; // 기본 시간 (9시)
  });
  
  const [minutes, setMinutes] = useState<string>(() => {
    if (editTask?.dueDate) {
      return String(editTask.dueDate.getMinutes()).padStart(2, '0');
    }
    return "00"; // 기본 분 (0분)
  });

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
    
    // 날짜와 시간을 결합
    const combinedDueDate = new Date(dueDate);
    combinedDueDate.setHours(parseInt(hours), parseInt(minutes));
    
    if (editTask) {
      // Update existing task
      updateTask(editTask.id, {
        title,
        description,
        dueDate: combinedDueDate,
        priority,
      });
    } else {
      // Add new task
      addTask({
        title,
        description,
        dueDate: combinedDueDate,
        priority,
        completed: false
      });
    }
    
    // Close form
    onSubmit();
  };

  // 시간 옵션을 생성하는 함수
  const generateTimeOptions = (max: number, pad: boolean = true) => {
    return Array.from({ length: max }, (_, i) => {
      const value = String(i);
      return pad ? value.padStart(2, '0') : value;
    });
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
        <div className="flex items-center gap-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={`flex-1 justify-start text-left font-normal ${!dueDate ? "text-muted-foreground" : ""}`}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dueDate ? format(dueDate, "yyyy년 MM월 dd일") : <span>날짜 선택</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto">
              <Calendar
                mode="single"
                selected={dueDate}
                onSelect={(date) => {
                  setDueDate(date);
                  setError(null);
                }}
                initialFocus
                className="pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
        </div>
        
        {/* Time picker */}
        <div className="flex items-center gap-2 mt-2">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <div className="flex items-center gap-1">
            <Select value={hours} onValueChange={setHours}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="시간" />
              </SelectTrigger>
              <SelectContent>
                {generateTimeOptions(24).map((hour) => (
                  <SelectItem key={hour} value={hour}>{hour}시</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span>:</span>
            <Select value={minutes} onValueChange={setMinutes}>
              <SelectTrigger className="w-[70px]">
                <SelectValue placeholder="분" />
              </SelectTrigger>
              <SelectContent>
                {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((minute) => (
                  <SelectItem key={minute} value={minute}>{minute}분</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
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
