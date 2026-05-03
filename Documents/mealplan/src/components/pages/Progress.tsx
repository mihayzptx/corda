'use client';

import { useDailyLogs } from '@/hooks/useNutrition';
import { useWorkoutSessions } from '@/hooks/useWorkout';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export function ProgressPage() {
  const { logs } = useDailyLogs(30);
  const { sessions } = useWorkoutSessions(30);

  // Prepare weight chart data
  const weightData = logs
    .filter((log) => log.bodyWeight)
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      weight: log.bodyWeight,
    }))
    .reverse();

  // Prepare macro adherence
  const macroData = logs
    .map((log) => ({
      date: new Date(log.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      kcal: log.totalKcal,
      protein: log.totalProtein,
    }))
    .reverse();

  // Workout volume
  const workoutData = Array.from({ length: 4 }, (_, i) => {
    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 28 + i * 7);
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekSessions = sessions.filter((s) => s.date >= weekStart.getTime() && s.date <= weekEnd.getTime());
    const volume = weekSessions.reduce((sum, s) => sum + s.sets.length, 0);

    return {
      week: `W${i + 1}`,
      volume,
    };
  });

  return (
    <div className="p-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Progress Tracking</h1>
        <p className="text-zinc-400 text-sm">Last 30 days</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider">Workouts</p>
          <p className="text-2xl font-bold mt-2">{sessions.length}</p>
        </div>
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          <p className="text-zinc-400 text-xs uppercase tracking-wider">Avg Weight</p>
          <p className="text-2xl font-bold mt-2">
            {logs.length > 0
              ? (logs.reduce((sum, l) => sum + (l.bodyWeight || 0), 0) / logs.filter((l) => l.bodyWeight).length).toFixed(1)
              : '—'}{' '}
            kg
          </p>
        </div>
      </div>

      {/* Weight Chart */}
      {weightData.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
          <h2 className="font-semibold mb-4">Body Weight Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={weightData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" domain="dataMin - 1" />
              <Tooltip
                contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }}
                labelStyle={{ color: '#fafafa' }}
              />
              <Line type="monotone" dataKey="weight" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Macro Chart */}
      {macroData.length > 0 && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
          <h2 className="font-semibold mb-4">Calorie & Protein Intake</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={macroData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="date" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
              <Legend />
              <Line type="monotone" dataKey="kcal" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
              <Line type="monotone" dataKey="protein" stroke="#22c55e" strokeWidth={2} dot={{ fill: '#22c55e' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Volume Chart */}
      {workoutData.some((d) => d.volume > 0) && (
        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800 mb-6">
          <h2 className="font-semibold mb-4">Weekly Workout Volume</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={workoutData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#3f3f46" />
              <XAxis dataKey="week" stroke="#a1a1aa" />
              <YAxis stroke="#a1a1aa" />
              <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #3f3f46' }} />
              <Line type="monotone" dataKey="volume" stroke="#f97316" strokeWidth={2} dot={{ fill: '#f97316' }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No Data State */}
      {logs.length === 0 && sessions.length === 0 && (
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800 text-center">
          <p className="text-zinc-400">No data yet. Start logging workouts and nutrition to see progress!</p>
        </div>
      )}
    </div>
  );
}
