
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { getCalendarDays, isToday, isCurrentMonth, formatDate } from '@/lib/date-utils';
import { useTasks } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import TaskForm from '@/components/Tasks/TaskForm';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { addMonths, isSameDay } from 'date-fns';

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

const MonthCalendar: React.FC = () => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  
  const { tasks } = useTasks();
  const calendarDays = getCalendarDays(currentMonth);
  
  const nextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };
  
  const prevMonth = () => {
    setCurrentMonth(addMonths(currentMonth, -1));
  };
  
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };
  
  const handleAddTask = (date: Date) => {
    setSelectedDate(date);
    setAddDialogOpen(true);
  };
  
  // Group tasks by date
  const tasksByDate: Record<string, Task[]> = {};
  tasks.forEach(task => {
    const dateKey = task.dueDate.toDateString();
    if (!tasksByDate[dateKey]) {
      tasksByDate[dateKey] = [];
    }
    tasksByDate[dateKey].push(task);
  });
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">
          {formatDate(currentMonth, 'yyyy년 MM월')}
        </h2>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={prevMonth}>
            <ChevronLeft size={18} />
          </Button>
          <Button variant="outline" size="icon" onClick={nextMonth}>
            <ChevronRight size={18} />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 gap-1">
        {daysOfWeek.map(day => (
          <div key={day} className="text-center p-2 font-medium">
            {day}
          </div>
        ))}
        
        {calendarDays.map((day, index) => {
          const isCurrentMonthDay = isCurrentMonth(day, currentMonth);
          const dayTasks = tasksByDate[day.toDateString()] || [];
          
          return (
            <div
              key={index}
              className={`calendar-day ${isToday(day) ? 'today' : ''} ${isCurrentMonthDay ? '' : 'different-month'}`}
              onClick={() => handleDateClick(day)}
            >
              <div className="flex justify-between items-start">
                <span className="font-medium text-sm">{day.getDate()}</span>
                {isCurrentMonthDay && (
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5 opacity-50 hover:opacity-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAddTask(day);
                    }}
                  >
                    <Plus size={14} />
                  </Button>
                )}
              </div>
              
              {dayTasks.length > 0 && (
                <div className="mt-1 space-y-1">
                  {dayTasks.slice(0, 2).map(task => (
                    <div 
                      key={task.id} 
                      className={`text-xs px-1 py-0.5 rounded truncate ${task.completed ? 'line-through opacity-50' : ''}`}
                      style={{ backgroundColor: `var(--task-${task.priority})` }}
                    >
                      {task.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <div className="text-xs text-muted-foreground px-1">
                      +{dayTasks.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
      
      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate && formatDate(selectedDate, 'yyyy년 MM월 dd일')}에 새 태스크 추가
            </DialogTitle>
          </DialogHeader>
          <TaskForm 
            onSubmit={() => setAddDialogOpen(false)} 
            editTask={selectedDate ? {
              id: '',
              title: '',
              description: '',
              dueDate: selectedDate,
              priority: 'medium',
              completed: false,
              createdAt: new Date()
            } : undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MonthCalendar;
