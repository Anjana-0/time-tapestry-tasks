
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { DayAnalytics } from '@/types';
import { format, isSameDay } from 'date-fns';

interface CalendarViewProps {
  analytics: DayAnalytics[];
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}

export const CalendarView: React.FC<CalendarViewProps> = ({
  analytics,
  selectedDate,
  onDateSelect
}) => {
  const getAnalyticsForDate = (date: Date) => {
    return analytics.find(a => isSameDay(new Date(a.date), date));
  };

  const selectedAnalytics = getAnalyticsForDate(selectedDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Activity Calendar</CardTitle>
        </CardHeader>
        <CardContent>
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            className="rounded-md border pointer-events-auto"
            modifiers={{
              hasActivity: (date) => {
                const dayAnalytics = getAnalyticsForDate(date);
                return dayAnalytics ? dayAnalytics.totalTasks > 0 : false;
              }
            }}
            modifiersStyles={{
              hasActivity: {
                backgroundColor: '#3b82f6',
                color: 'white',
                borderRadius: '50%'
              }
            }}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            {format(selectedDate, 'MMMM dd, yyyy')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {selectedAnalytics ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedAnalytics.totalTasks}
                  </div>
                  <div className="text-sm text-gray-600">Total Tasks</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedAnalytics.completedTasks}
                  </div>
                  <div className="text-sm text-gray-600">Completed</div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Period Activity</h4>
                <div className="space-y-2">
                  {Object.entries(selectedAnalytics.periodActivity).map(([period, count]) => (
                    <div key={period} className="flex justify-between items-center">
                      <span className="text-sm">{period}</span>
                      <Badge variant="secondary">{count} tasks</Badge>
                    </div>
                  ))}
                </div>
              </div>

              {selectedAnalytics.mostActivePeriod && (
                <div className="p-3 bg-yellow-50 rounded-lg">
                  <div className="text-sm font-medium text-yellow-800">
                    Most Active Period
                  </div>
                  <div className="text-lg font-bold text-yellow-600">
                    {selectedAnalytics.mostActivePeriod}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-8">
              <div className="text-4xl mb-2">📅</div>
              <p>No activity on this date</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
