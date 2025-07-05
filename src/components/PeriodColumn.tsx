
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { TaskCard } from './TaskCard';
import { Period, Task } from '@/types';
import { Plus } from 'lucide-react';

interface PeriodColumnProps {
  period: Period;
  onAddTask: (periodId: string) => void;
  onToggleComplete: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, task: Task) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, periodId: string) => void;
}

export const PeriodColumn: React.FC<PeriodColumnProps> = ({
  period,
  onAddTask,
  onToggleComplete,
  onDeleteTask,
  onDragStart,
  onDragOver,
  onDrop
}) => {
  const completedTasks = period.tasks.filter(task => task.completed).length;
  const totalTasks = period.tasks.length;

  return (
    <Card className="h-fit min-h-[400px] bg-gradient-to-br from-white to-gray-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{period.emoji}</span>
            <CardTitle className="text-lg">{period.name}</CardTitle>
          </div>
          <Badge variant="secondary" className="text-xs">
            {completedTasks}/{totalTasks}
          </Badge>
        </div>
        <Button
          onClick={() => onAddTask(period.id)}
          size="sm"
          className="w-full mt-2"
          variant="outline"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Task
        </Button>
      </CardHeader>
      
      <CardContent 
        className="space-y-3 min-h-[300px] p-4"
        onDragOver={onDragOver}
        onDrop={(e) => onDrop(e, period.id)}
      >
        {period.tasks.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <div className="text-4xl mb-2">📝</div>
            <p>No tasks yet</p>
            <p className="text-sm">Add your first task!</p>
          </div>
        ) : (
          period.tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDeleteTask}
              onDragStart={onDragStart}
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};
