
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Period, Task, DayAnalytics } from '@/types';

interface AnalyticsProps {
  periods: Period[];
  analytics: DayAnalytics[];
}

export const Analytics: React.FC<AnalyticsProps> = ({ periods, analytics }) => {
  // Calculate overall statistics
  const totalTasks = periods.reduce((sum, period) => sum + period.tasks.length, 0);
  const completedTasks = periods.reduce((sum, period) => 
    sum + period.tasks.filter(task => task.completed).length, 0
  );
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Most active period
  const periodTaskCounts = periods.map(period => ({
    name: period.name,
    emoji: period.emoji,
    totalTasks: period.tasks.length,
    completedTasks: period.tasks.filter(task => task.completed).length
  }));

  const mostActivePeriod = periodTaskCounts.reduce((max, current) => 
    current.totalTasks > max.totalTasks ? current : max, 
    periodTaskCounts[0] || { name: 'None', emoji: '📝', totalTasks: 0, completedTasks: 0 }
  );

  // Most used emojis
  const emojiCounts: Record<string, number> = {};
  periods.forEach(period => {
    period.tasks.forEach(task => {
      if (task.emoji) {
        emojiCounts[task.emoji] = (emojiCounts[task.emoji] || 0) + 1;
      }
    });
  });

  const topEmojis = Object.entries(emojiCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  // Recent activity (last 7 days)
  const recentAnalytics = analytics.slice(-7);
  const averageDailyTasks = recentAnalytics.length > 0 
    ? recentAnalytics.reduce((sum, day) => sum + day.totalTasks, 0) / recentAnalytics.length 
    : 0;

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-blue-600">{totalTasks}</div>
            <p className="text-sm text-gray-600">Total Tasks</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
            <p className="text-sm text-gray-600">Completed</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-purple-600">
              {completionRate.toFixed(0)}%
            </div>
            <p className="text-sm text-gray-600">Completion Rate</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold text-orange-600">
              {averageDailyTasks.toFixed(1)}
            </div>
            <p className="text-sm text-gray-600">Avg Daily Tasks</p>
          </CardContent>
        </Card>
      </div>

      {/* Period Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Period Activity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {periodTaskCounts.map(period => (
              <div key={period.name} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span>{period.emoji}</span>
                    <span className="font-medium">{period.name}</span>
                  </div>
                  <Badge variant="secondary">
                    {period.completedTasks}/{period.totalTasks}
                  </Badge>
                </div>
                <Progress 
                  value={period.totalTasks > 0 ? (period.completedTasks / period.totalTasks) * 100 : 0}
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Most Used Emojis</CardTitle>
          </CardHeader>
          <CardContent>
            {topEmojis.length > 0 ? (
              <div className="space-y-3">
                {topEmojis.map(([emoji, count], index) => (
                  <div key={emoji} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{emoji}</span>
                      <span className="text-sm text-gray-600">#{index + 1}</span>
                    </div>
                    <Badge variant="outline">{count} times</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-400 py-4">
                <p>No emojis used yet</p>
                <p className="text-sm">Start adding emojis to your tasks!</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Most Active Period Highlight */}
      {mostActivePeriod.totalTasks > 0 && (
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50">
          <CardContent className="p-6">
            <div className="text-center">
              <div className="text-4xl mb-2">{mostActivePeriod.emoji}</div>
              <h3 className="text-xl font-bold mb-1">Most Active Period</h3>
              <p className="text-lg text-purple-600 font-medium">{mostActivePeriod.name}</p>
              <p className="text-sm text-gray-600">
                {mostActivePeriod.totalTasks} tasks • {mostActivePeriod.completedTasks} completed
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
