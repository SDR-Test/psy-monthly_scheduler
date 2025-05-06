
import React from 'react';
import { Task } from '@/lib/types';
import { formatDate } from '@/lib/date-utils';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash, Edit, Clock } from 'lucide-react';
import { useTasks } from '@/context/TaskContext';

interface TaskItemProps {
  task: Task;
  onEdit: (task: Task) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onEdit }) => {
  const { toggleComplete, deleteTask } = useTasks();

  const priorityClass = task.priority;
  
  return (
    <div className={`task-card ${priorityClass} ${task.completed ? 'opacity-60' : ''}`}>
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <Checkbox 
            checked={task.completed} 
            onCheckedChange={() => toggleComplete(task.id)}
            className="mt-1" 
          />
          <div>
            <h3 className={`font-medium ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
              {task.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">{task.description}</p>
            <div className="flex items-center gap-1 text-xs font-medium text-foreground/70 mt-2">
              <span>마감일: {formatDate(task.dueDate, 'yyyy년 MM월 dd일')}</span>
              <Clock className="h-3 w-3" />
              <span>{formatDate(task.dueDate, 'HH:mm')}</span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => onEdit(task)}
            className="h-8 w-8"
          >
            <Edit size={16} />
          </Button>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={() => deleteTask(task.id)}
            className="h-8 w-8 text-destructive hover:bg-destructive/10"
          >
            <Trash size={16} />
          </Button>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <span className={`task-dot priority-${task.priority}`}></span>
        <span className="text-xs capitalize">{
          task.priority === 'low' ? '낮음' :
          task.priority === 'medium' ? '중간' : '높음'
        }</span>
      </div>
    </div>
  );
};

export default TaskItem;
