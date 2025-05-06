
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay } from 'date-fns';

// Get all dates for a calendar month view (including dates from adjacent months)
export const getCalendarDays = (date: Date): Date[] => {
  const firstDayOfMonth = startOfMonth(date);
  const lastDayOfMonth = endOfMonth(date);
  
  const startDay = new Date(firstDayOfMonth);
  // Adjust to start from Sunday (0) or Monday (1) depending on preference
  startDay.setDate(startDay.getDate() - startDay.getDay());
  
  const endDay = new Date(lastDayOfMonth);
  // Ensure we include enough days to complete the grid (6 rows of 7 days)
  const daysToAdd = (6 * 7) - (endOfMonth(date).getDate() + startDay.getDay());
  endDay.setDate(endDay.getDate() + daysToAdd);
  
  return eachDayOfInterval({ start: startDay, end: endDay });
};

// Check if a date is today
export const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

// Check if a date is in the current month
export const isCurrentMonth = (date: Date, currentMonth: Date): boolean => {
  return isSameMonth(date, currentMonth);
};

// Format a date for display
export const formatDate = (date: Date, formatString: string): string => {
  return format(date, formatString);
};

// Sort tasks by due date (earliest first)
export const sortTasksByDueDate = (a: { dueDate: Date }, b: { dueDate: Date }): number => {
  return a.dueDate.getTime() - b.dueDate.getTime();
};
