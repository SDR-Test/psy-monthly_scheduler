
import React, { useEffect } from 'react';
import { differenceInDays, isAfter, startOfMonth, endOfMonth } from 'date-fns';
import { useTasks } from '@/context/TaskContext';
import { toast } from 'sonner';
import { Task } from '@/lib/types';
import { Bell, BellRing, Trophy } from 'lucide-react';

const CLOSE_DUE_DAYS = 3;
const NOTIFICATION_DELAY = 300; // ms between notifications

const TaskNotifications: React.FC = () => {
  const { tasks, updateTask } = useTasks();
  const today = new Date();

  useEffect(() => {
    const checkNotifications = async () => {
      // Get incomplete tasks
      const incompleteTasks = tasks.filter(task => !task.completed);
      
      // Check for close deadlines
      const closeDueTasks = incompleteTasks.filter(task => {
        const daysLeft = differenceInDays(task.dueDate, today);
        return daysLeft >= 0 && daysLeft < CLOSE_DUE_DAYS && !task.notifiedCloseDue;
      });

      // Check for overdue tasks
      const overdueTasks = incompleteTasks.filter(task => {
        return isAfter(today, task.dueDate) && !task.notifiedOverdue;
      });

      // Show close due notifications with delay
      for (const task of closeDueTasks) {
        await showCloseDueNotification(task);
      }

      // Show overdue notifications with delay
      for (const task of overdueTasks) {
        await showOverdueNotification(task);
      }

      // Check for monthly achievement
      checkMonthlyAchievement();
    };

    const showCloseDueNotification = async (task: Task) => {
      toast(
        <div className="flex items-center gap-2">
          <BellRing className="h-5 w-5 text-red-500" />
          <div>
            <strong>서둘러요!</strong>
            <p className="text-sm">{task.title}의 마감이 {differenceInDays(task.dueDate, today)}일 남았습니다! 지금 당장 하세요!</p>
          </div>
        </div>,
        {
          duration: 5000,
        }
      );
      
      // Mark as notified
      updateTask(task.id, { notifiedCloseDue: true });
      
      // Add delay between notifications
      return new Promise(resolve => setTimeout(resolve, NOTIFICATION_DELAY));
    };

    const showOverdueNotification = async (task: Task) => {
      const mockingMessages = [
        "와! 또 마감을 놓쳤군요! 달력을 사용하는 방법을 모르시나요?",
        "축하합니다! 마감일을 무시하는 특별한 재능이 있으시네요!",
        "시간은 당신을 기다려주지 않아요. 당신의 태스크도 마찬가지고요!",
        "마감일이 어제였다고요? 타임머신이라도 있으신가요?",
        "이 태스크는 기다리다 지쳐서 포기했을지도 모릅니다!",
        "마감을 놓친 당신을 위한 새로운 직업: 전문 미루기 전문가!"
      ];
      
      const randomMessage = mockingMessages[Math.floor(Math.random() * mockingMessages.length)];
      
      toast(
        <div className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-orange-500" />
          <div>
            <strong>이런!</strong>
            <p className="text-sm">{task.title}이(가) 마감일을 지났습니다!</p>
            <p className="text-xs italic">{randomMessage}</p>
          </div>
        </div>,
        {
          duration: 6000,
        }
      );
      
      // Mark as notified
      updateTask(task.id, { notifiedOverdue: true });
      
      // Add delay between notifications
      return new Promise(resolve => setTimeout(resolve, NOTIFICATION_DELAY));
    };

    const checkMonthlyAchievement = () => {
      // Get current month's start and end
      const monthStart = startOfMonth(today);
      const monthEnd = endOfMonth(today);
      
      // If it's the last day of month
      if (differenceInDays(monthEnd, today) === 0) {
        // Get all tasks due this month
        const thisMonthTasks = tasks.filter(task => {
          const dueDate = new Date(task.dueDate);
          return dueDate >= monthStart && dueDate <= monthEnd;
        });
        
        // Check if all tasks are completed
        const allCompleted = thisMonthTasks.length > 0 && thisMonthTasks.every(task => task.completed);
        
        if (allCompleted) {
          toast(
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <strong>대단해요! 월간 완벽 달성!</strong>
                <p className="text-sm">이번 달의 모든 태스크를 완료했습니다! 👏👏👏</p>
              </div>
            </div>,
            {
              duration: 8000,
            }
          );
        }
      }
    };

    // Run once on mount
    checkNotifications();
    
    // Set interval for periodic checking (every hour)
    const intervalId = setInterval(checkNotifications, 3600000);
    
    return () => clearInterval(intervalId);
  }, [tasks, updateTask]);

  return null; // This component doesn't render anything
};

export default TaskNotifications;
