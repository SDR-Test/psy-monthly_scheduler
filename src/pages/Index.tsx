
import React from 'react';
import { TaskProvider } from '@/context/TaskContext';
import Header from '@/components/Layout/Header';
import MonthCalendar from '@/components/Calendar/MonthCalendar';
import TaskList from '@/components/Tasks/TaskList';
import TaskNotifications from '@/components/Tasks/TaskNotifications';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

const Index = () => {
  return (
    <TaskProvider>
      <div className="min-h-screen flex flex-col">
        <Header />
        <TaskNotifications />
        
        <main className="flex-grow container py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card className="p-6">
                <MonthCalendar />
              </Card>
            </div>
            
            <div>
              <Card className="p-6">
                <TaskList />
              </Card>
            </div>
          </div>
        </main>
        
        <footer className="py-4 border-t text-center text-sm text-muted-foreground">
          <div className="container">
            <p>Monthly Task Muse © {new Date().getFullYear()}</p>
          </div>
        </footer>
      </div>
    </TaskProvider>
  );
};

export default Index;
