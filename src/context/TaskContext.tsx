
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { Task, TaskContextType } from '@/lib/types';
import { toast } from '@/hooks/use-toast';

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    // Try to load tasks from localStorage
    const savedTasks = localStorage.getItem('tasks');
    if (savedTasks) {
      try {
        // Convert date strings back to Date objects
        const parsedTasks = JSON.parse(savedTasks);
        return parsedTasks.map((task: any) => ({
          ...task,
          dueDate: new Date(task.dueDate),
          createdAt: new Date(task.createdAt)
        }));
      } catch (error) {
        console.error('Failed to parse tasks from localStorage:', error);
        return [];
      }
    }
    return [];
  });

  // Save to localStorage whenever tasks change
  React.useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date()
    };
    
    setTasks(prevTasks => [...prevTasks, newTask]);
    toast({
      title: "태스크가 추가되었습니다",
      description: `"${taskData.title}" 추가되었습니다.`
    });
  };

  const updateTask = (id: string, taskData: Partial<Task>) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id ? { ...task, ...taskData } : task
      )
    );
    toast({
      title: "태스크가 수정되었습니다",
      description: "변경 사항이 저장되었습니다."
    });
  };

  const deleteTask = (id: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
    toast({
      title: "태스크가 삭제되었습니다",
      variant: "destructive"
    });
  };

  const toggleComplete = (id: string) => {
    setTasks(prevTasks => 
      prevTasks.map(task => 
        task.id === id 
          ? { ...task, completed: !task.completed } 
          : task
      )
    );
  };

  return (
    <TaskContext.Provider value={{ tasks, addTask, updateTask, deleteTask, toggleComplete }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
};
