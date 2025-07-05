
export interface Task {
  id: string;
  title: string;
  description?: string;
  emoji?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  dueDate?: Date;
  period: string;
}

export interface Period {
  id: string;
  name: string;
  emoji: string;
  color: string;
  tasks: Task[];
}

export interface DayAnalytics {
  date: string;
  totalTasks: number;
  completedTasks: number;
  periodActivity: Record<string, number>;
  mostActivePeriod: string;
}
