
export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date; // 이미 Date 타입이므로 시간도 포함 가능
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  createdAt: Date;
  notifiedCloseDue?: boolean;
  notifiedOverdue?: boolean;
}

export interface TaskContextType {
  tasks: Task[];
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  toggleComplete: (id: string) => void;
}
