
import React, { useState } from 'react';
import { Task } from '@/lib/types';
import { useTasks } from '@/context/TaskContext';
import TaskItem from './TaskItem';
import TaskForm from './TaskForm';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { sortTasksByDueDate } from '@/lib/date-utils';

const TaskList: React.FC = () => {
  const { tasks } = useTasks();
  const [isAddDialogOpen, setAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setEditDialogOpen] = useState(false);
  const [currentEditTask, setCurrentEditTask] = useState<Task | null>(null);

  // Sort tasks by due date and filter out completed tasks
  const upcoming = [...tasks]
    .filter(task => !task.completed)
    .sort(sortTasksByDueDate);

  const completed = [...tasks]
    .filter(task => task.completed)
    .sort(sortTasksByDueDate);

  const handleAddClick = () => {
    setAddDialogOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setCurrentEditTask(task);
    setEditDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">태스크</h2>
        <Button onClick={handleAddClick} className="gap-1">
          <Plus size={18} />
          새 태스크
        </Button>
      </div>

      <div className="space-y-4">
        <div>
          <h3 className="font-medium text-sm text-muted-foreground mb-2">마감 예정 ({upcoming.length})</h3>
          {upcoming.length === 0 ? (
            <div className="p-4 bg-muted/30 rounded-md text-center text-muted-foreground">
              마감 예정인 태스크가 없습니다.
            </div>
          ) : (
            <div className="space-y-2">
              {upcoming.map(task => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          )}
        </div>

        {completed.length > 0 && (
          <div>
            <h3 className="font-medium text-sm text-muted-foreground mb-2">완료됨 ({completed.length})</h3>
            <div className="space-y-2">
              {completed.map(task => (
                <TaskItem key={task.id} task={task} onEdit={handleEditTask} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Task Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>새 태스크 추가</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={() => setAddDialogOpen(false)} />
        </DialogContent>
      </Dialog>

      {/* Edit Task Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>태스크 수정</DialogTitle>
          </DialogHeader>
          {currentEditTask && (
            <TaskForm 
              editTask={currentEditTask} 
              onSubmit={() => {
                setEditDialogOpen(false);
                setCurrentEditTask(null);
              }} 
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TaskList;
