
import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PeriodColumn } from '@/components/PeriodColumn';
import { TaskDialog } from '@/components/TaskDialog';
import { CalendarView } from '@/components/CalendarView';
import { Analytics } from '@/components/Analytics';
import { EmojiPicker } from '@/components/EmojiPicker';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { Period, Task, DayAnalytics } from '@/types';
import { format, startOfDay, isSameDay } from 'date-fns';
import { Plus, Settings } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const defaultPeriods: Period[] = [
  { id: 'morning', name: 'Morning', emoji: '🌅', color: 'bg-yellow-100', tasks: [] },
  { id: 'afternoon', name: 'Afternoon', emoji: '☀️', color: 'bg-orange-100', tasks: [] },
  { id: 'evening', name: 'Evening', emoji: '🌆', color: 'bg-purple-100', tasks: [] },
  { id: 'night', name: 'Night', emoji: '🌙', color: 'bg-blue-100', tasks: [] },
];

const Index = () => {
  const [periods, setPeriods] = useLocalStorage<Period[]>('todo-periods', defaultPeriods);
  const [analytics, setAnalytics] = useLocalStorage<DayAnalytics[]>('todo-analytics', []);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [taskDialogOpen, setTaskDialogOpen] = useState(false);
  const [currentPeriodId, setCurrentPeriodId] = useState<string>('');
  const [newPeriodDialogOpen, setNewPeriodDialogOpen] = useState(false);
  const [newPeriodName, setNewPeriodName] = useState('');
  const [newPeriodEmoji, setNewPeriodEmoji] = useState('');
  const [draggedTask, setDraggedTask] = useState<Task | null>(null);

  // Generate daily analytics
  const generateAnalytics = (periodsData: Period[]) => {
    const today = format(startOfDay(new Date()), 'yyyy-MM-dd');
    const todayTasks = periodsData.flatMap(p => p.tasks);
    
    if (todayTasks.length === 0) return;

    const periodActivity: Record<string, number> = {};
    periodsData.forEach(period => {
      const todayPeriodTasks = period.tasks.filter(task => 
        isSameDay(new Date(task.createdAt), new Date())
      );
      if (todayPeriodTasks.length > 0) {
        periodActivity[period.name] = todayPeriodTasks.length;
      }
    });

    const mostActivePeriod = Object.entries(periodActivity)
      .reduce((max, [period, count]) => count > max.count ? { period, count } : max, 
        { period: '', count: 0 }).period;

    const newAnalytics: DayAnalytics = {
      date: today,
      totalTasks: todayTasks.length,
      completedTasks: todayTasks.filter(t => t.completed).length,
      periodActivity,
      mostActivePeriod
    };

    setAnalytics(prev => {
      const existingIndex = prev.findIndex(a => a.date === today);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = newAnalytics;
        return updated;
      }
      return [...prev, newAnalytics];
    });
  };

  useEffect(() => {
    generateAnalytics(periods);
  }, [periods]);

  const handleAddTask = (periodId: string) => {
    setCurrentPeriodId(periodId);
    setTaskDialogOpen(true);
  };

  const handleSaveTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    setPeriods(prev => prev.map(period => 
      period.id === currentPeriodId 
        ? { ...period, tasks: [...period.tasks, newTask] }
        : period
    ));

    toast({
      title: "Task added!",
      description: `"${newTask.title}" has been added to ${periods.find(p => p.id === currentPeriodId)?.name}`,
    });
  };

  const handleToggleComplete = (taskId: string) => {
    setPeriods(prev => prev.map(period => ({
      ...period,
      tasks: period.tasks.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined
            }
          : task
      )
    })));
  };

  const handleDeleteTask = (taskId: string) => {
    setPeriods(prev => prev.map(period => ({
      ...period,
      tasks: period.tasks.filter(task => task.id !== taskId)
    })));
    
    toast({
      title: "Task deleted",
      description: "The task has been removed.",
    });
  };

  const handleDragStart = (e: React.DragEvent, task: Task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetPeriodId: string) => {
    e.preventDefault();
    
    if (!draggedTask) return;

    // Remove task from source period and add to target period
    setPeriods(prev => prev.map(period => {
      if (period.tasks.some(task => task.id === draggedTask.id)) {
        // Source period - remove task
        return {
          ...period,
          tasks: period.tasks.filter(task => task.id !== draggedTask.id)
        };
      } else if (period.id === targetPeriodId) {
        // Target period - add task
        return {
          ...period,
          tasks: [...period.tasks, { ...draggedTask, period: targetPeriodId }]
        };
      }
      return period;
    }));

    setDraggedTask(null);
    
    toast({
      title: "Task moved!",
      description: `Task moved to ${periods.find(p => p.id === targetPeriodId)?.name}`,
    });
  };

  const handleAddPeriod = () => {
    if (!newPeriodName.trim()) return;

    const newPeriod: Period = {
      id: crypto.randomUUID(),
      name: newPeriodName.trim(),
      emoji: newPeriodEmoji || '📝',
      color: 'bg-gray-100',
      tasks: []
    };

    setPeriods(prev => [...prev, newPeriod]);
    setNewPeriodName('');
    setNewPeriodEmoji('');
    setNewPeriodDialogOpen(false);
    
    toast({
      title: "Period added!",
      description: `${newPeriod.name} has been added to your workflow.`,
    });
  };

  const getDailySummary = () => {
    const today = new Date();
    const todayTasks = periods.flatMap(period => 
      period.tasks.filter(task => isSameDay(new Date(task.createdAt), today))
    );
    
    const completedToday = todayTasks.filter(task => task.completed).length;
    const totalToday = todayTasks.length;
    
    const mostActivePeriod = periods.reduce((max, period) => {
      const periodTodayTasks = period.tasks.filter(task => 
        isSameDay(new Date(task.createdAt), today)
      ).length;
      return periodTodayTasks > max.count ? { name: period.name, count: periodTodayTasks } : max;
    }, { name: '', count: 0 });

    return {
      totalTasks: totalToday,
      completedTasks: completedToday,
      completionRate: totalToday > 0 ? Math.round((completedToday / totalToday) * 100) : 0,
      mostActivePeriod: mostActivePeriod.name || 'None'
    };
  };

  const summary = getDailySummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Time Tapestry Tasks
              </h1>
              <p className="text-gray-600 mt-2">Organize your day, one moment at a time</p>
            </div>
            <Button
              onClick={() => setNewPeriodDialogOpen(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Settings className="w-4 h-4" />
              Add Period
            </Button>
          </div>

          {/* Daily Summary */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border">
              <div className="text-2xl font-bold text-blue-600">{summary.totalTasks}</div>
              <div className="text-sm text-gray-600">Today's Tasks</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border">
              <div className="text-2xl font-bold text-green-600">{summary.completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border">
              <div className="text-2xl font-bold text-purple-600">{summary.completionRate}%</div>
              <div className="text-sm text-gray-600">Success Rate</div>
            </div>
            <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 border">
              <div className="text-lg font-bold text-orange-600">{summary.mostActivePeriod}</div>
              <div className="text-sm text-gray-600">Most Active</div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
            <TabsTrigger value="tasks">Tasks</TabsTrigger>
            <TabsTrigger value="calendar">Calendar</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {periods.map(period => (
                <PeriodColumn
                  key={period.id}
                  period={period}
                  onAddTask={handleAddTask}
                  onToggleComplete={handleToggleComplete}
                  onDeleteTask={handleDeleteTask}
                  onDragStart={handleDragStart}
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <CalendarView
              analytics={analytics}
              selectedDate={selectedDate}
              onDateSelect={setSelectedDate}
            />
          </TabsContent>

          <TabsContent value="analytics">
            <Analytics periods={periods} analytics={analytics} />
          </TabsContent>
        </Tabs>

        {/* Task Dialog */}
        <TaskDialog
          open={taskDialogOpen}
          onOpenChange={setTaskDialogOpen}
          onSave={handleSaveTask}
          periodId={currentPeriodId}
        />

        {/* Add Period Dialog */}
        <Dialog open={newPeriodDialogOpen} onOpenChange={setNewPeriodDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Period</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Input
                    placeholder="Period name (e.g., Late Night)"
                    value={newPeriodName}
                    onChange={(e) => setNewPeriodName(e.target.value)}
                  />
                </div>
                <EmojiPicker onEmojiSelect={setNewPeriodEmoji} selectedEmoji={newPeriodEmoji} />
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setNewPeriodDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddPeriod} disabled={!newPeriodName.trim()}>
                  Add Period
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default Index;
