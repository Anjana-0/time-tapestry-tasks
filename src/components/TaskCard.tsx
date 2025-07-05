
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/types';
import { format } from 'date-fns';
import { Trash2, Calendar } from 'lucide-react';

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string) => void;
  onDelete: (id: string) => void;
  draggable?: boolean;
  onDragStart?: (e: React.DragEvent, task: Task) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onToggleComplete,
  onDelete,
  draggable = true,
  onDragStart
}) => {
  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md cursor-move ${
        task.completed ? 'opacity-70 bg-gray-50' : ''
      }`}
      draggable={draggable}
      onDragStart={(e) => onDragStart?.(e, task)}
    >
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1"
          />
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              {task.emoji && <span className="text-lg">{task.emoji}</span>}
              <h3 className={`font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}>
                {task.title}
              </h3>
            </div>
            
            {task.description && (
              <p className={`text-sm text-gray-600 mb-2 ${task.completed ? 'line-through' : ''}`}>
                {task.description}
              </p>
            )}
            
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {task.dueDate && (
                  <Badge variant="outline" className="text-xs">
                    <Calendar className="w-3 h-3 mr-1" />
                    {format(new Date(task.dueDate), 'MMM dd')}
                  </Badge>
                )}
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(task.id)}
                className="text-red-500 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
